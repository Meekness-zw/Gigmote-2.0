import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth.config";
import { isDeviceTrustedFor } from "@/lib/admin-trust";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Quick lookup: should the admin login form submit to the trusted-device
 * provider or the magic-link provider for this email?
 *
 * Called by the login page BEFORE auth happens, so an attacker probing
 * with `someone@foo.com` only learns whether that email is allowlisted
 * AND has a trust cookie set in their browser — which they can already
 * answer for themselves by trying to sign in. No new info disclosed.
 *
 * Rate-limited regardless, to slow down enumeration of the allowlist.
 */
export async function POST(req: Request) {
  const rl = await rateLimit("begin-signin", {
    limit: 15,
    windowMs: 5 * 60_000,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const { email } = await req.json();
    const lower = String(email ?? "").trim().toLowerCase();
    if (!lower || !isAdminEmail(lower)) {
      // Don't tell unauthorized callers whether the email is real.
      return NextResponse.json({ ok: true, method: "magic-link" });
    }
    const trusted = await isDeviceTrustedFor(lower);
    return NextResponse.json({
      ok: true,
      method: trusted ? "trusted-device" : "magic-link",
    });
  } catch {
    return NextResponse.json({ ok: true, method: "magic-link" });
  }
}
