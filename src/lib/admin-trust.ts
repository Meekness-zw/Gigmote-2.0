import { createHmac, timingSafeEqual as cryptoTimingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Trusted-device cookie for the admin panel.
 *
 * Flow:
 *   1. Admin signs in via magic link (Nodemailer / email).
 *   2. On successful sign-in we set a long-lived (1 year) HMAC-signed
 *      cookie keyed to that admin's email.
 *   3. On future sign-ins from the same browser, the trusted-device
 *      credentials provider can authorize without sending a fresh link.
 *   4. Sign-out clears the cookie. So does a credentials rotation
 *      (the HMAC is signed with AUTH_SECRET — rotate the secret to
 *      invalidate every trusted device at once).
 *
 * Format: `<email>|<expiresMs>|<hmacHex>`
 */

export const TRUST_COOKIE_NAME = "gm-admin-trust";
const TTL_DAYS = 365;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

function signingKey(): string {
  const k = process.env.AUTH_SECRET;
  if (!k) {
    // Refuse to sign anything if no secret is configured. Returning a
    // fixed string would make every "trusted device" trivially forgeable.
    throw new Error("AUTH_SECRET is not set — cannot sign trust cookies.");
  }
  return k;
}

function sign(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("hex");
}

export function buildTrustToken(email: string): string {
  const expires = Date.now() + TTL_MS;
  const payload = `${email.toLowerCase()}|${expires}`;
  return `${payload}|${sign(payload)}`;
}

/**
 * Verify a trust token against an email. Uses timing-safe comparison so
 * a remote attacker can't probe the HMAC by measuring response times.
 */
export function verifyTrustToken(token: string, email: string): boolean {
  const parts = token.split("|");
  if (parts.length !== 3) return false;
  const [storedEmail, expiresStr, sig] = parts;
  if (storedEmail.toLowerCase() !== email.toLowerCase()) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  let expected: string;
  try {
    expected = sign(`${storedEmail}|${expiresStr}`);
  } catch {
    return false;
  }
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  try {
    return cryptoTimingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function readTrustedEmail(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(TRUST_COOKIE_NAME)?.value;
  if (!value) return null;
  const parts = value.split("|");
  if (parts.length !== 3) return null;
  const email = parts[0].toLowerCase();
  if (!verifyTrustToken(value, email)) return null;
  return email;
}

export async function isDeviceTrustedFor(email: string): Promise<boolean> {
  const trusted = await readTrustedEmail();
  return !!trusted && trusted === email.toLowerCase();
}

export async function setTrustCookie(email: string): Promise<void> {
  const store = await cookies();
  store.set({
    name: TRUST_COOKIE_NAME,
    value: buildTrustToken(email),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearTrustCookie(): Promise<void> {
  const store = await cookies();
  store.set({
    name: TRUST_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
