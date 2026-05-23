import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Auth.js edge middleware. Gates /admin/* and /api/admin/* via the
 * `authorized` callback in authConfig.
 *
 *   /admin/login        → always public
 *   /admin/...          → requires signed-in admin (redirect to /login if not)
 *   /api/admin/...      → requires signed-in admin (returns 401 JSON, no redirect)
 *
 * Anything outside the matcher is untouched.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
