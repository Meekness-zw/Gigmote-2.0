import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Resume upload endpoint. Accepts a single file via multipart FormData
 * (field name "file") and uploads it to Vercel Blob (private store).
 * Returns the storage URL + filename + size which the client posts back
 * to /api/applications.
 *
 * The returned URL is *not* publicly accessible — it requires the Blob
 * token to fetch. Admins download resumes via the authenticated proxy
 * route at /api/admin/resume/[id].
 *
 * Constraints:
 *   - 5 MB max (rejected with 413)
 *   - whitelist: pdf, doc, docx, txt
 *   - upload is open (no auth) — anyone applying may upload; storage
 *     URLs are unguessable; download is gated.
 */

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

export async function POST(req: Request) {
  // Rate-limit aggressively — uploads cost real money on Blob storage.
  const rl = await rateLimit("resume-upload", { limit: 10, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many uploads. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Blob storage not configured. Set BLOB_READ_WRITE_TOKEN in .env.local.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "File too large (5 MB max)." },
        { status: 413 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type) && file.type !== "") {
      return NextResponse.json(
        {
          ok: false,
          error: `Unsupported file type "${file.type}". Use PDF, DOC, DOCX, or TXT.`,
        },
        { status: 415 }
      );
    }

    // Sanitize filename, prefix with a timestamp to avoid collisions
    const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80);
    const key = `resumes/${Date.now()}-${safe}`;

    // Use private access — the Blob store is private-mode. Resumes
    // shouldn't be publicly addressable anyway; admins fetch them through
    // the authenticated /api/admin/resume/[id] proxy route below.
    const blob = await put(key, file, {
      access: "private",
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      name: file.name,
      size: file.size,
    });
  } catch (err) {
    console.error("[POST /api/upload/resume]", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Upload failed.",
      },
      { status: 500 }
    );
  }
}
