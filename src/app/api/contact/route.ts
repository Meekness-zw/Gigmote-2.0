import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Contact form submission. Persists the inquiry to the ContactInquiry
 * table and (if SMTP is configured) sends a notification email.
 *
 * Rate-limited to 5 submissions / 10 minutes per IP.
 */
export async function POST(req: Request) {
  const rl = await rateLimit("contact", { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const body = await req.json();
    const { name, email, company, team, service, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required." },
        { status: 400 }
      );
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }
    if (String(message).length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message too long (max 5,000 chars)." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        company: company ? String(company).slice(0, 200) : null,
        teamSize: team ? String(team).slice(0, 50) : null,
        service: service ? String(service).slice(0, 200) : null,
        message: String(message).slice(0, 5000),
      },
    });

    // Best-effort SMTP notification — fire-and-forget so the form
    // responds fast even if the mail provider is slow.
    if (process.env.SMTP_HOST) {
      sendNotification(inquiry).catch((e) =>
        console.error("contact email failed", e)
      );
    }

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}

async function sendNotification(inquiry: {
  name: string;
  email: string;
  company: string | null;
  teamSize: string | null;
  service: string | null;
  message: string;
}) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from:
      process.env.SMTP_FROM_EMAIL ??
      process.env.SMTP_FROM ??
      "admin@gigmote.com",
    to:
      process.env.CONTACT_TO_EMAIL ??
      process.env.CONTACT_NOTIFY_TO ??
      "info@gigmote.com",
    replyTo: inquiry.email,
    subject: `New contact inquiry — ${inquiry.name}`,
    text:
      `From: ${inquiry.name} <${inquiry.email}>\n` +
      `Company: ${inquiry.company ?? "—"}\n` +
      `Team size: ${inquiry.teamSize ?? "—"}\n` +
      `Service: ${inquiry.service ?? "—"}\n\n` +
      inquiry.message,
  });
}
