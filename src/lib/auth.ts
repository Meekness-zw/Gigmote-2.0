import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { authConfig, isAdminEmail } from "./auth.config";
import {
  clearTrustCookie,
  isDeviceTrustedFor,
  setTrustCookie,
} from "./admin-trust";

export { isAdminEmail } from "./auth.config";

/**
 * Auth.js setup.
 *
 * Providers:
 *   1. Nodemailer (magic link) — first-time sign-in path. Sends a one-
 *      time URL to the admin's email. Requires SMTP_HOST to be set.
 *   2. Credentials("trusted-device") — only works if the current browser
 *      has a valid HMAC-signed trust cookie for the email (set when the
 *      magic link was last used). Lets repeat admins sign in without
 *      re-emailing them every time.
 *
 * On any successful sign-in we refresh the trust cookie for another year.
 * On sign-out we clear it — that browser must redo the magic link.
 *
 * If SMTP isn't configured (purely local dev with no email service),
 * we fall back to a "Dev sign-in" provider that accepts any allowlisted
 * email without trust verification. This branch is dead in production
 * because production always has SMTP set.
 */
const providers: any[] = [];
const smtpConfigured = Boolean(process.env.SMTP_HOST);
const isProd = process.env.NODE_ENV === "production";

if (smtpConfigured) {
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  providers.push(
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from:
        process.env.SMTP_FROM_EMAIL ??
        process.env.SMTP_FROM ??
        process.env.SMTP_USER,
    })
  );

  // Production: trusted-device only. Sign-in requires the cookie set
  // by a successful magic-link sign-in.
  providers.push(
    Credentials({
      id: "trusted-device",
      name: "Trusted Device",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        if (!email || !isAdminEmail(email)) return null;
        if (!(await isDeviceTrustedFor(email))) return null;
        // Touch the User row so the session/jwt callback has something.
        const user = await prisma.user.upsert({
          where: { email },
          create: { email, name: email.split("@")[0] },
          update: {},
        });
        return { id: user.id, email: user.email, name: user.name };
      },
    })
  );
} else if (!isProd) {
  // Dev escape hatch — no SMTP configured locally. Any allowlisted email
  // can sign in with just the email field, no link verification. Only
  // mounted when both SMTP is unconfigured AND we're not in production.
  providers.push(
    Credentials({
      id: "dev-signin",
      name: "Dev sign-in",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        if (!email || !isAdminEmail(email)) return null;
        const user = await prisma.user.upsert({
          where: { email },
          create: { email, name: email.split("@")[0] },
          update: {},
        });
        return { id: user.id, email: user.email, name: user.name };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers,
  events: {
    async signIn({ user, account }) {
      // After ANY successful sign-in (magic link, trusted device, or
      // dev-signin) refresh the trust cookie so the browser stays
      // remembered for another year. Only set for allowlisted emails.
      if (!user?.email || !isAdminEmail(user.email)) return;
      const p = account?.provider;
      if (p === "nodemailer" || p === "trusted-device" || p === "dev-signin") {
        await setTrustCookie(user.email);
      }
    },
    async signOut() {
      await clearTrustCookie();
    },
  },
});
