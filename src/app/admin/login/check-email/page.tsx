import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata = { title: "Check your email" };

export default function CheckEmailPage() {
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
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-10 text-center">
        <Link
          href="/admin/login"
          data-cursor="link"
          className="group inline-flex items-center gap-2 self-start text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute transition-colors hover:text-cream"
        >
          <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </Link>

        <div className="my-auto">
          <div className="relative mx-auto mb-8 grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/5">
            <Mail size={20} className="text-gold" />
          </div>

          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            Check your email.
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cream-dim">
            We just sent a magic link to your inbox. Click it to finish signing
            in. Links expire after 24 hours.
          </p>

          <div className="hairline my-10" />

          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-mute">
            Didn't get it? Check spam, then try again.
          </p>
        </div>
      </div>
    </div>
  );
}
