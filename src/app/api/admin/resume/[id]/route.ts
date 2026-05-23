import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { auth, isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Admin-only resume download proxy.
 *
 *   GET /api/admin/resume/{applicationId}
 *
 * Validates that the requester is an admin, fetches the application's
 * resume from the private Blob store using the read/write token, then
 * streams the bytes back to the browser. The browser never sees the
 * underlying Blob URL — it only ever talks to our own origin.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "Blob storage not configured." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    select: { resumeUrl: true, resumeName: true },
  });
  if (!application?.resumeUrl) {
    return NextResponse.json(
      { ok: false, error: "No resume on file." },
      { status: 404 }
    );
  }

  // SSRF guard — only fetch URLs we actually issued. Any value not
  // hosted on vercel-storage.com is rejected even if it somehow ended up
  // in the DB. Defends against a future bug where a third party could
  // plant an arbitrary URL into resumeUrl.
  try {
    const u = new URL(application.resumeUrl);
    const isBlobHost =
      u.protocol === "https:" &&
      (u.hostname.endsWith(".private.blob.vercel-storage.com") ||
        u.hostname.endsWith(".public.blob.vercel-storage.com"));
    if (!isBlobHost) {
      return NextResponse.json(
        { ok: false, error: "Stored resume URL is not a recognized Blob host." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Stored resume URL is malformed." },
      { status: 400 }
    );
  }

  try {
    const result = await get(application.resumeUrl, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || result.statusCode !== 200) {
      return NextResponse.json(
        { ok: false, error: "Resume not found in storage." },
        { status: 404 }
      );
    }

    const disposition = application.resumeName
      ? `attachment; filename="${application.resumeName.replace(/"/g, "")}"`
      : "attachment";

    return new Response(result.stream as any, {
      headers: {
        "Content-Type":
          result.headers?.get?.("content-type") ?? "application/octet-stream",
        "Content-Disposition": disposition,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/resume/{id}]", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to fetch resume.",
      },
      { status: 500 }
    );
  }
}
