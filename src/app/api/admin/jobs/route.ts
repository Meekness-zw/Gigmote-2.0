import { NextResponse } from "next/server";
import { auth, isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) return false;
  return true;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Admin job CRUD.
 *   POST   /api/admin/jobs              — create a new job
 *   PATCH  /api/admin/jobs              — update an existing job
 *   DELETE /api/admin/jobs              — delete a job
 */

export async function POST(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const b = await req.json();
    if (!b.title || !b.location || !b.employmentType) {
      return NextResponse.json(
        { ok: false, error: "Title, location and type are required." },
        { status: 400 }
      );
    }
    const slug = (b.slug && slugify(b.slug)) || slugify(b.title);
    const existing = await prisma.job.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "A job with this slug already exists." },
        { status: 409 }
      );
    }
    const job = await prisma.job.create({
      data: {
        slug,
        title: String(b.title),
        department: b.department ? String(b.department) : null,
        location: String(b.location),
        employmentType: String(b.employmentType),
        salaryRange: b.salaryRange ? String(b.salaryRange) : null,
        shortDescription: String(b.shortDescription ?? "").slice(0, 500),
        description: String(b.description ?? "").slice(0, 10000),
        responsibilities: String(b.responsibilities ?? "").slice(0, 10000),
        requirements: String(b.requirements ?? "").slice(0, 10000),
        niceToHave: b.niceToHave ? String(b.niceToHave).slice(0, 10000) : null,
        benefits: b.benefits ? String(b.benefits).slice(0, 10000) : null,
        applyEmail: b.applyEmail ? String(b.applyEmail) : null,
        status: b.status === "draft" ? "draft" : "published",
      },
    });
    return NextResponse.json({ ok: true, job });
  } catch (err) {
    console.error("[POST /api/admin/jobs]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const b = await req.json();
    if (!b.id) {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const job = await prisma.job.update({
      where: { id: String(b.id) },
      data: {
        ...(b.title !== undefined && { title: String(b.title) }),
        ...(b.department !== undefined && {
          department: b.department ? String(b.department) : null,
        }),
        ...(b.location !== undefined && { location: String(b.location) }),
        ...(b.employmentType !== undefined && {
          employmentType: String(b.employmentType),
        }),
        ...(b.salaryRange !== undefined && {
          salaryRange: b.salaryRange ? String(b.salaryRange) : null,
        }),
        ...(b.shortDescription !== undefined && {
          shortDescription: String(b.shortDescription).slice(0, 500),
        }),
        ...(b.description !== undefined && {
          description: String(b.description).slice(0, 10000),
        }),
        ...(b.responsibilities !== undefined && {
          responsibilities: String(b.responsibilities).slice(0, 10000),
        }),
        ...(b.requirements !== undefined && {
          requirements: String(b.requirements).slice(0, 10000),
        }),
        ...(b.niceToHave !== undefined && {
          niceToHave: b.niceToHave ? String(b.niceToHave).slice(0, 10000) : null,
        }),
        ...(b.status !== undefined && {
          status: b.status === "draft" ? "draft" : "published",
        }),
      },
    });
    return NextResponse.json({ ok: true, job });
  } catch (err) {
    console.error("[PATCH /api/admin/jobs]", err);
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
    await prisma.job.delete({ where: { id: String(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/jobs]", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
