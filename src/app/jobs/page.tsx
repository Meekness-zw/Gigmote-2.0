import Link from "next/link";
import { ArrowUpRight, MapPin, Briefcase } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABlock } from "@/components/sections/CTABlock";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Open roles",
  description:
    "Live job board for Gigmote operators. Engineering, customer experience, AI operations, and more.",
};

// Always render fresh — admin writes new jobs continuously.
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const live = await prisma.job.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });

  // Group by department
  const grouped = live.reduce<Record<string, typeof live>>((acc, j) => {
    const key = j.department ?? "Other";
    (acc[key] ??= []).push(j);
    return acc;
  }, {});

  const subtitle = live.length
    ? `${live.length} open ${
        live.length === 1 ? "role" : "roles"
      } across ${Object.keys(grouped).length} ${
        Object.keys(grouped).length === 1 ? "department" : "departments"
      }. Long-term placements only — no freelance gigs.`
    : "No open roles right now — check back soon or join the talent bench at /join-gigmote.";

  return (
    <>
      <PageHero
        eyebrow="Open roles"
        title="The bench we're building."
        subtitle={subtitle}
        scene="network"
      />

      {/* Stats strip */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-4">
            <StatCell label="Open roles" value={String(live.length)} accent />
            <StatCell
              label="Departments"
              value={String(Object.keys(grouped).length)}
            />
            <StatCell label="Time zones" value="Global" />
            <StatCell label="Engagement" value="Full-time · Long-term" />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 space-y-16 md:space-y-20">
          {live.length === 0 ? (
            <FadeIn>
              <div className="rounded-3xl border border-cream-line bg-ink-2 p-12 text-center">
                <p className="font-display text-2xl tracking-tight">
                  No open positions right now.
                </p>
                <p className="mt-3 max-w-md mx-auto text-sm text-cream-dim">
                  We're between hiring rounds. Join the talent bench and we'll
                  reach out when a role matching your background opens.
                </p>
                <div className="mt-8">
                  <Link
                    href="/join-gigmote"
                    data-cursor="magnet"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:scale-[1.02] transition-transform"
                  >
                    Join the bench
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            Object.entries(grouped).map(([dept, roles], gi) => (
              <FadeIn key={dept} delay={gi * 0.04}>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 className="font-display text-2xl leading-tight tracking-tighter md:text-3xl">
                    {dept}
                  </h2>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                    {roles.length} {roles.length === 1 ? "role" : "roles"}
                  </div>
                </div>

                <ul className="divide-y divide-cream-line border-y border-cream-line">
                  {roles.map((job) => (
                    <li key={job.slug}>
                      <Link
                        href={`/jobs/${job.slug}`}
                        data-cursor="link"
                        className="group grid grid-cols-1 items-center gap-3 py-6 md:grid-cols-[2fr_1fr_1fr_120px] md:gap-8"
                      >
                        <div>
                          <div className="font-display text-xl leading-tight tracking-tight md:text-2xl group-hover:text-gold transition-colors">
                            {job.title}
                          </div>
                          <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-cream-dim">
                            {job.shortDescription}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-cream-dim">
                          <MapPin size={13} className="text-cream-mute" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-cream-dim">
                          <Briefcase size={13} className="text-cream-mute" />
                          {job.employmentType}
                        </div>
                        <div className="flex items-center justify-start gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold md:justify-end">
                          Apply
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))
          )}
        </div>
      </section>

      <CTABlock />
    </>
  );
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink-2 p-6">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
        {label}
      </div>
      <div
        className={`mt-1 font-display tracking-tight ${
          accent ? "text-gold" : "text-cream"
        } ${value.length > 10 ? "text-lg" : "text-3xl"}`}
      >
        {value}
      </div>
    </div>
  );
}
