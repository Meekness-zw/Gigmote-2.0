import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Jobs" };
export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { applications: true } } },
  });

  const live = jobs.filter((j) => j.status === "published").length;

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow mb-3">— Talent bench</div>
          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            Jobs
          </h1>
          <p className="mt-2 text-sm text-cream-dim">
            {jobs.length} {jobs.length === 1 ? "post" : "posts"} · {live} live
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          data-cursor="magnet"
          className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-[#0F0F12] transition-transform hover:scale-[1.02]"
        >
          <Plus size={14} />
          New job post
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-cream-line">
        <div className="grid grid-cols-[2fr_1fr_1fr_120px_100px_120px] border-b border-cream-line bg-ink-2 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-mute">
          <div>Title</div>
          <div className="hidden md:block">Department</div>
          <div className="hidden md:block">Location</div>
          <div className="text-center">Apps</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-cream-mute">
              No jobs yet. Click <span className="text-gold">New job post</span> to create one.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-line">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="grid grid-cols-[2fr_1fr_1fr_120px_100px_120px] items-center px-6 py-5 transition-colors hover:bg-ink-2"
              >
                <div>
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    data-cursor="link"
                    className="font-medium text-cream hover:text-gold"
                  >
                    {job.title}
                  </Link>
                  <div className="mt-1 text-xs text-cream-mute md:hidden">
                    {job.department} · {job.location}
                  </div>
                </div>
                <div className="hidden text-sm text-cream-dim md:block">
                  {job.department ?? "—"}
                </div>
                <div className="hidden text-sm text-cream-dim md:block">
                  {job.location}
                </div>
                <div className="text-center">
                  <Link
                    href={`/admin/applications?job=${job.slug}`}
                    data-cursor="link"
                    className="inline-flex items-center gap-1.5 font-mono text-xs"
                  >
                    <span className="rounded-md bg-gold/15 px-1.5 py-0.5 font-semibold text-gold">
                      {job._count.applications}
                    </span>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <StatusPill status={job.status as "published" | "draft"} />
                </div>
                <div className="flex justify-end gap-3 text-xs">
                  <Link
                    href={`/jobs/${job.slug}`}
                    data-cursor="link"
                    className="text-cream-mute hover:text-cream"
                    target="_blank"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    data-cursor="link"
                    className="text-cream hover:text-gold"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-cream-mute">
        <span className="font-mono uppercase tracking-[0.18em]">Live data</span>
        <Link
          href="/admin"
          data-cursor="link"
          className="group inline-flex items-center gap-1.5 transition-colors hover:text-gold"
        >
          Back to dashboard
          <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "published" | "draft" }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-success">
        <span className="h-1 w-1 rounded-full bg-success" />
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cream-faint bg-cream-faint px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-mute">
      Draft
    </span>
  );
}
