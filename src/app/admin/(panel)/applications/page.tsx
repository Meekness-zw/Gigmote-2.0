import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

type AppStatus = "new" | "reviewing" | "shortlisted" | "rejected" | "hired";

function relTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return date.toLocaleDateString();
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; job?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = (params.status as AppStatus | undefined) ?? null;
  const jobFilter = params.job ?? null;

  const where: any = {};
  if (statusFilter && statusFilter !== "all") where.status = statusFilter;
  if (jobFilter) where.job = { slug: jobFilter };

  const [apps, counts] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true, slug: true } } },
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  const total = counts.reduce((acc, c) => acc + c._count, 0);

  const filters: Array<{ label: string; key: AppStatus | "all"; count: number }> = [
    { label: "All", key: "all", count: total },
    { label: "New", key: "new", count: countMap.new ?? 0 },
    { label: "Reviewing", key: "reviewing", count: countMap.reviewing ?? 0 },
    { label: "Shortlisted", key: "shortlisted", count: countMap.shortlisted ?? 0 },
    { label: "Hired", key: "hired", count: countMap.hired ?? 0 },
    { label: "Rejected", key: "rejected", count: countMap.rejected ?? 0 },
  ];

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow mb-3">— Pipeline</div>
          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            Applications
          </h1>
          <p className="mt-2 text-sm text-cream-dim">
            {apps.length} {apps.length === 1 ? "result" : "results"}
            {statusFilter && statusFilter !== "all" && ` · filtered to "${statusFilter}"`}
            {jobFilter && ` · job: ${jobFilter}`}
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active =
            (statusFilter ?? "all") === f.key ||
            (!statusFilter && f.key === "all");
          const href = f.key === "all" ? "/admin/applications" : `/admin/applications?status=${f.key}`;
          return (
            <Link
              key={f.key}
              href={href}
              data-cursor="link"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                active
                  ? "border-gold/60 bg-gold/10 text-gold"
                  : "border-cream-faint text-cream-dim hover:border-cream/40 hover:text-cream"
              }`}
            >
              <span>{f.label}</span>
              <span className="text-cream-mute">{f.count}</span>
            </Link>
          );
        })}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-3xl border border-cream-line">
        {apps.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-cream-mute">
              No applications match this filter.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-line">
            {apps.map((app) => (
              <li
                key={app.id}
                className="grid grid-cols-1 gap-3 px-6 py-5 transition-colors hover:bg-ink-2 md:grid-cols-[2fr_2fr_1fr_120px] md:items-center md:gap-6"
              >
                <div>
                  <Link
                    href={`/admin/applications/${app.id}`}
                    data-cursor="link"
                    className="font-medium text-cream hover:text-gold"
                  >
                    {app.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-cream-mute">
                    <a
                      href={`mailto:${app.email}`}
                      className="inline-flex items-center gap-1 hover:text-cream"
                    >
                      <Mail size={11} />
                      {app.email}
                    </a>
                    {app.phone && (
                      <a
                        href={`tel:${app.phone}`}
                        className="inline-flex items-center gap-1 hover:text-cream"
                      >
                        <Phone size={11} />
                        {app.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-cream">{app.job.title}</div>
                  {app.portfolioLink && (
                    <a
                      href={app.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block text-xs text-cream-mute hover:text-gold"
                    >
                      Portfolio →
                    </a>
                  )}
                </div>

                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  {relTime(app.createdAt)}
                </div>

                <div className="flex md:justify-end">
                  <StatusBadge status={app.status as AppStatus} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-cream-mute">
        <Link
          href="/admin"
          data-cursor="link"
          className="group inline-flex items-center gap-1.5 transition-colors hover:text-cream"
        >
          <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>
        <span className="font-mono uppercase tracking-[0.18em]">Live data</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AppStatus }) {
  const map: Record<
    AppStatus,
    { label: string; border: string; bg: string; text: string; dot: string }
  > = {
    new: { label: "New", border: "border-gold/40", bg: "bg-gold/10", text: "text-gold", dot: "bg-gold" },
    reviewing: { label: "Reviewing", border: "border-cream/40", bg: "bg-cream/5", text: "text-cream", dot: "bg-cream" },
    shortlisted: { label: "Shortlisted", border: "border-teal/40", bg: "bg-teal/10", text: "text-teal", dot: "bg-teal" },
    hired: { label: "Hired", border: "border-success/40", bg: "bg-success/10", text: "text-success", dot: "bg-success" },
    rejected: { label: "Rejected", border: "border-cream-faint", bg: "bg-cream-faint", text: "text-cream-mute", dot: "bg-cream-mute" },
  };
  const m = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${m.border} ${m.bg} px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${m.text}`}
    >
      <span className={`h-1 w-1 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}
