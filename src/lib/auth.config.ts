import type { NextAuthConfig } from "next-auth";

/**
 * Admin allowlist — only these emails can ever sign in to the admin panel.
 * Comma-separated values in `ADMIN_EMAILS`. The list is read fresh from
 * the environment each call so changing the env var doesn't require a
 * cold restart.
 *
 * If the allowlist is empty (env var unset), no one can sign in. This is
 * the safe default — a misconfigured deploy never accidentally lets the
 * world in. There is no hard-coded fallback.
 */
function readAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const list = readAllowlist();
  return list.includes(email.toLowerCase());
};

/**
 * Edge-safe NextAuth config (no Node-only modules — no Prisma, no Nodemailer).
 * Imported by middleware. `auth.ts` extends this with the Prisma adapter +
 * provider list for the Node runtime.
 */
// Refuse to fall back to a placeholder secret in production. A missing
// AUTH_SECRET in prod would let Auth.js auto-generate a random one per
// cold start — different on every serverless instance, guaranteeing
// "no matching decryption secret" on every session lookup.
const authSecret = (() => {
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is missing or too short in production. " +
        "Set a 32+ char value (e.g. `openssl rand -base64 32`) in your Vercel env vars."
    );
  }
  return "dev-secret-change-me-in-production-9f3a8b2c1d4e5f6a7b8c9d0e1f2a3b4c";
})();

export const authConfig = {
  secret: authSecret,
  trustHost: true,
  pages: {
    signIn: "/admin/login",
    verifyRequest: "/admin/login/check-email",
    error: "/admin/login",
  },
  session: { strategy: "jwt" as const },
  providers: [],
  callbacks: {
    async signIn({ user }: { user: { email?: string | null } }) {
      return isAdminEmail(user.email);
    },
    async jwt({
      token,
      user,
    }: {
      token: any;
      user?: { email?: string | null };
    }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.email && session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
    /**
     * Edge-safe authorization gate. Runs in middleware (proxy.ts).
     *
     * Policy:
     *   /admin/login*         → always public (the sign-in flow lives here)
     *   /admin/*              → requires signed-in admin; redirects to login
     *   /api/admin/*          → requires signed-in admin; returns 401 JSON
     *                            (no redirect — JSON clients don't follow)
     *   anything else         → untouched (the proxy matcher excludes it)
     */
    async authorized({ auth: a, request }: { auth: any; request: Request }) {
      const url = new URL(request.url);
      const path = url.pathname;
      const isLogin = path.startsWith("/admin/login");
      if (isLogin) return true;

      const isPanel = path.startsWith("/admin");
      const isApi = path.startsWith("/api/admin");
      if (!isPanel && !isApi) return true;

      const allowed = !!a?.user?.email && isAdminEmail(a.user.email);
      if (allowed) return true;

      // For API routes return a plain 401 JSON instead of an HTML redirect.
      if (isApi) {
        return new Response(
          JSON.stringify({ ok: false, error: "Unauthorized" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      return false; // Auth.js redirects to pages.signIn for panel routes.
    },
  },
} satisfies NextAuthConfig;
