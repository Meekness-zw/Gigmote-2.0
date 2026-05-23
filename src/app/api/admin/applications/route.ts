import { NextResponse } from "next/server";
import { auth, isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Admin-only: update application status (or delete).
 * PATCH /api/admin/applications { id, status }
 * DELETE /api/admin/applications { id }
 */
async function ensureAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return false;
  }
  return true;
}

const ALLOWED_STATUS = new Set([
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
]);

export async function PATCH(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    if (!id || !ALLOWED_STATUS.has(status)) {
      return NextResponse.json(
        { ok: false, error: "id and valid status required" },
        { status: 400 }
      );
    }
    const updated = await prisma.application.update({
      where: { id: String(id) },
      data: { status: String(status) },
    });
    return NextResponse.json({ ok: true, application: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/applications]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    await prisma.application.delete({ where: { id: String(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/applications]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
