import Link from "next/link";
import { ArrowUpRight, Plus, Briefcase, Users, FileText, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

function relTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return date.toLocaleDateString();
}

export default async function AdminDashboard() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [
    publishedCount,
    appsLastWeek,
    pendingCount,
    totalApps,
    recentApps,
  ] = await Promise.all([
    prisma.job.count({ where: { status: "published" } }),
    prisma.application.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.application.count({ where: { status: { in: ["new", "reviewing"] } } }),
    prisma.application.count(),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { job: { select: { title: true, slug: true } } },
    }),
  ]);

  const STATS = [
    { label: "Active jobs", value: String(publishedCount), icon: Briefcase },
    { label: "Applications · last 7d", value: String(appsLastWeek), icon: Users },
    { label: "Pending review", value: String(pendingCount), icon: FileText },
    { label: "Lifetime applications", value: String(totalApps), icon: TrendingUp },
  ];

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label-eyebrow mb-3">— Operations console</div>
          <h1 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-cream-dim">
            Live view of the talent bench and pipeline.
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative bg-ink-2 p-6">
              <div className="flex items-start justify-between">
                <Icon size={16} className="text-cream-mute" />
              </div>
              <div className="mt-4 font-display text-3xl leading-none tracking-tight md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent applications */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-end justify-between">
            <div className="label-eyebrow">— Recent applications</div>
            <Link
              href="/admin/applications"
              data-cursor="link"
              className="group inline-flex items-center gap-1.5 text-xs text-cream-dim transition-colors hover:text-gold"
            >
              View all
              <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream-line bg-ink-2">
            {recentApps.length === 0 ? (
              <div className="p-8 text-center text-sm text-cream-mute">
                No applications yet — the form on{" "}
                <Link href="/join-gigmote" className="text-gold hover:underline">
                  /join-gigmote
                </Link>{" "}
                writes here.
              </div>
            ) : (
              <ul className="divide-y divide-cream-line">
                {recentApps.map((a) => (
                  <li key={a.id} className="px-5 py-4">
                    <Link
                      href={`/admin/applications/${a.id}`}
                      data-cursor="link"
                      className="flex flex-wrap items-center gap-2 text-sm hover:text-gold transition-colors"
                    >
                      <span className="font-medium text-cream">{a.name}</span>
                      <span className="text-cream-mute">applied to</span>
                      <span className="text-gold">{a.job.title}</span>
                      <span className="ml-auto text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                        {relTime(a.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="mb-5 label-eyebrow">— Quick actions</div>
          <div className="space-y-3">
            <QuickAction href="/admin/jobs/new" label="Post new job" />
            <QuickAction
              href="/admin/applications?status=new"
              label={`Review pending (${pendingCount})`}
            />
            <QuickAction href="/admin/jobs?status=draft" label="Drafts" />
            <QuickAction href="/" label="View public site" external />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      data-cursor="link"
      className="group flex items-center justify-between gap-3 rounded-xl border border-cream-line bg-ink-2 px-5 py-4 transition-colors hover:border-gold/40 hover:bg-ink-3"
    >
      <span className="text-sm text-cream">{label}</span>
      <ArrowUpRight
        size={14}
        className="text-cream-mute transition-all group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
