import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Application submission. Looks up the job by slug if provided, else
 * stores a generic "any role" application.
 *
 * Rate-limited to 5 submissions / 10 minutes per IP.
 */
export async function POST(req: Request) {
  const rl = await rateLimit("applications", { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      location,
      role,
      seniority,
      linkedin,
      portfolio,
      proudest,
      metric,
      notes,
      jobSlug,
      resumeUrl,
      resumeName,
      resumeSize,
    } = body ?? {};

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required." },
        { status: 400 }
      );
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Find the target job. If `jobSlug` not provided, attach to the first
    // role matching the chosen role name; otherwise to "any role" bucket.
    let job = null;
    if (jobSlug) {
      job = await prisma.job.findUnique({ where: { slug: String(jobSlug) } });
    } else if (role) {
      // Best-effort match — try to find a job whose title contains the role
      job = await prisma.job.findFirst({
        where: {
          title: { contains: String(role).split(" ")[0] },
          status: "published",
        },
      });
    }
    if (!job) {
      // No matching job? Fall back to the first published role so the
      // record has a parent. Better UX than rejecting the submission.
      job = await prisma.job.findFirst({ where: { status: "published" } });
    }
    if (!job) {
      return NextResponse.json(
        { ok: false, error: "No active roles to apply to." },
        { status: 503 }
      );
    }

    const coverLetterParts = [
      role ? `Role: ${role}` : null,
      seniority ? `Seniority: ${seniority}` : null,
      location ? `Location: ${location}` : null,
      proudest ? `\nProudest work:\n${proudest}` : null,
      metric ? `\nMetric owned:\n${metric}` : null,
      notes ? `\nNotes:\n${notes}` : null,
    ].filter(Boolean);

    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        phone: phone ? String(phone).slice(0, 60) : null,
        portfolioLink: portfolio
          ? String(portfolio).slice(0, 500)
          : linkedin
          ? String(linkedin).slice(0, 500)
          : null,
        coverLetter: coverLetterParts.join("\n").slice(0, 5000),
        // Resume metadata. Only persisted if /api/upload/resume succeeded
        // first — the form sends the public Blob URL back here.
        resumeUrl: resumeUrl ? String(resumeUrl).slice(0, 1000) : null,
        resumeName: resumeName ? String(resumeName).slice(0, 200) : null,
        resumeSize:
          typeof resumeSize === "number" && Number.isFinite(resumeSize)
            ? Math.floor(resumeSize)
            : null,
        status: "new",
      },
    });

    if (process.env.SMTP_HOST) {
      sendNotification(application, job.title).catch((e) =>
        console.error("application email failed", e)
      );
    }

    return NextResponse.json({ ok: true, id: application.id });
  } catch (err) {
    console.error("[POST /api/applications]", err);
    return NextResponse.json(
      { ok: false, error: "Server error." },
      { status: 500 }
    );
  }
}

async function sendNotification(
  a: {
    name: string;
    email: string;
    coverLetter: string | null;
    resumeUrl: string | null;
    resumeName: string | null;
    portfolioLink: string | null;
  },
  jobTitle: string
) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const lines = [
    `From: ${a.name} <${a.email}>`,
    a.portfolioLink ? `Portfolio: ${a.portfolioLink}` : null,
    a.resumeUrl ? `Resume: ${a.resumeName ?? "attached"} — ${a.resumeUrl}` : null,
    "",
    a.coverLetter ?? "",
  ].filter(Boolean);

  await transporter.sendMail({
    from:
      process.env.SMTP_FROM_EMAIL ??
      process.env.SMTP_FROM ??
      "admin@gigmote.com",
    to:
      process.env.CONTACT_TO_EMAIL ??
      process.env.CONTACT_NOTIFY_TO ??
      "info@gigmote.com",
    replyTo: a.email,
    subject: `New application — ${a.name} (${jobTitle})`,
    text: lines.join("\n"),
  });
}
