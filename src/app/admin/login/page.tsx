"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Loader2, AlertTriangle } from "lucide-react";

/**
 * Admin sign-in page.
 *
 * Flow:
 *   1. User types email and submits.
 *   2. We POST it to /api/admin-signin which decides whether this device
 *      is trusted for that email.
 *   3. If trusted: signIn("trusted-device") — instant session, no email.
 *      If not:     signIn("nodemailer") — sends a magic link, then we
 *                  navigate to /admin/login/check-email.
 *
 * Auth.js' `pages.error` is set to `/admin/login`, so any signin failure
 * ends up back here with `?error=...`. We surface the message inline
 * instead of just bouncing the user to a blank form.
 */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick up any error Auth.js sent us back with.
  useEffect(() => {
    const code = params.get("error");
    if (!code) return;
    setError(humanizeAuthError(code));
  }, [params]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setError(null);

    const lower = email.trim().toLowerCase();
    try {
      // 1. Decide trusted-device vs magic-link
      const probe = await fetch("/api/admin-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lower }),
      });
      const decision = await probe.json().catch(() => ({}));
      if (probe.status === 429) {
        throw new Error(decision.error ?? "Too many attempts. Try again later.");
      }

      const method = decision.method as "trusted-device" | "magic-link";

      // 2. Try trusted device first if applicable
      if (method === "trusted-device") {
        const res = await signIn("trusted-device", {
          email: lower,
          redirect: false,
        });
        if (res?.ok) {
          window.location.href = "/admin";
          return;
        }
        // Trust verification failed — fall through to magic link.
      }

      // 3. Magic link. redirect:false so we can surface real errors
      //    instead of letting Auth.js bounce to /admin/login?error=...
      const res = await signIn("nodemailer", {
        email: lower,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (!res) {
        throw new Error(
          "Sign-in service unavailable. SMTP isn't configured on the server."
        );
      }
      if (res.error) {
        throw new Error(humanizeAuthError(res.error));
      }

      // Success — Auth.js sent the email. Show the check-inbox screen.
      window.location.href = "/admin/login/check-email";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <LoginShell>
      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
            Work email
          </span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@gigmote.com"
            className="w-full rounded-xl border border-cream-line bg-ink-2 px-4 py-3 text-sm text-cream placeholder:text-cream-mute focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          data-cursor="magnet"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
        >
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Signing in
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-4 text-sm text-cream">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </LoginShell>
  );
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-grain bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(246,206,72,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute">
          <Link
            href="/"
            data-cursor="link"
            className="group inline-flex items-center gap-2 transition-colors hover:text-cream"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            Back to site
          </Link>
          <span>Internal · Admin only</span>
        </div>

        <div className="my-auto">
          <div className="mb-10 flex items-center gap-3">
            <span className="relative grid h-6 w-6 place-items-center">
              <span className="absolute inset-0 rounded-full border border-gold/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <span className="font-display text-xl font-medium tracking-tight">
              Gigmote · Admin
            </span>
          </div>

          <div className="label-eyebrow mb-5 inline-flex items-center gap-2">
            <Lock size={11} className="text-gold" />
            <span>Sign in</span>
          </div>
          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            Access the operations console.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-cream-dim">
            Enter your work email. First sign-in on a new device sends a
            magic link to your inbox. Once verified, this browser stays
            trusted for a year.
          </p>

          {children}

          <div className="hairline my-10" />

          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-mute">
            Auth.js · Magic link · HMAC-signed trust cookie
          </p>
        </div>

        <div className="mt-auto pt-10 text-xs text-cream-mute">
          Trouble signing in? Email{" "}
          <a
            href="mailto:info@gigmote.com"
            className="text-gold hover:underline"
          >
            info@gigmote.com
          </a>
        </div>
      </div>
    </div>
  );
}

function humanizeAuthError(code: string): string {
  switch (code) {
    case "EmailSignin":
    case "EmailSignInError":
      return "Couldn't send the magic-link email. The server's SMTP credentials may be missing or incorrect — check SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL in Vercel env vars.";
    case "AccessDenied":
      return "That email isn't on the admin allowlist. Check ADMIN_EMAILS on the server.";
    case "Verification":
      return "The magic link expired or has already been used. Request a new one.";
    case "CredentialsSignin":
      return "Trusted-device sign-in failed. Request a magic link to re-verify this browser.";
    case "Configuration":
      return "Server configuration error. AUTH_SECRET or the provider list is missing.";
    default:
      return `Sign-in failed (${code}).`;
  }
}
