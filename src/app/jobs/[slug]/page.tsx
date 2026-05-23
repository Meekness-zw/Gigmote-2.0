import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { CTABlock } from "@/components/sections/CTABlock";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const j = await prisma.job.findUnique({ where: { slug } });
  if (!j) return { title: "Role" };
  return { title: j.title, description: j.shortDescription };
}

function relPosted(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({ where: { slug } });
  if (!job || job.status !== "published") notFound();

  const responsibilities = job.responsibilities
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const requirements = job.requirements
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const niceToHave = (job.niceToHave ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const benefits = (job.benefits ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const others = await prisma.job.findMany({
    where: {
      status: "published",
      slug: { not: job.slug },
      department: job.department ?? undefined,
    },
    take: 3,
  });

  return (
    <>
      <PageHero
        eyebrow={`Role · ${job.department ?? "Open"}`}
        title={job.title}
        subtitle={job.shortDescription}
        scene="network"
      />

      {/* Meta strip */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-4">
            <MetaCell icon={MapPin} label="Location" value={job.location} />
            <MetaCell icon={Briefcase} label="Type" value={job.employmentType} />
            <MetaCell
              icon={DollarSign}
              label="Compensation"
              value={job.salaryRange ?? "Competitive"}
            />
            <MetaCell
              icon={Clock}
              label="Posted"
              value={relPosted(job.createdAt)}
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <aside className="md:col-span-3">
              <div className="md:sticky md:top-32 space-y-6">
                <div>
                  <div className="label-eyebrow">— Quick apply</div>
                  <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                    Application is a single form on the Join Gigmote page.
                    Mention the role title in the notes field.
                  </p>
                </div>
                <Button
                  href={`/join-gigmote?role=${encodeURIComponent(job.title)}`}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Apply for this role
                  <ArrowRight size={14} />
                </Button>
              </div>
            </aside>

            <div className="md:col-span-9 space-y-14 md:space-y-20">
              <FadeIn>
                <div className="label-eyebrow mb-5">— About the role</div>
                <p className="text-base leading-relaxed text-cream-dim md:text-lg">
                  {job.description}
                </p>
              </FadeIn>

              <Block label="What you'll own" items={responsibilities} />
              <Block label="What we're looking for" items={requirements} />
              {niceToHave.length > 0 && (
                <Block label="Nice to have" items={niceToHave} muted />
              )}
              {benefits.length > 0 && (
                <Block label="Benefits" items={benefits} muted />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <section className="relative border-b border-cream-line bg-ink py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <Link
            href="/jobs"
            data-cursor="link"
            className="group inline-flex items-center gap-2 rounded-full border border-cream-faint px-5 py-2.5 text-sm text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            All open roles
          </Link>

          {others.length > 0 && (
            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-mute">
                More in {job.department}
              </span>
              <div className="flex flex-wrap gap-2">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/jobs/${o.slug}`}
                    data-cursor="link"
                    className="rounded-full border border-cream-faint px-3 py-1 text-xs text-cream-dim transition-colors hover:border-gold/40 hover:text-cream"
                  >
                    {o.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTABlock />
    </>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-ink-2 p-5">
      <Icon size={14} className="mt-1 shrink-0 text-gold" />
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
          {label}
        </div>
        <div className="mt-1 text-sm font-medium text-cream">{value}</div>
      </div>
    </div>
  );
}

function Block({
  label,
  items,
  muted,
}: {
  label: string;
  items: string[];
  muted?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <FadeIn>
      <div className="label-eyebrow mb-5">— {label}</div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                muted ? "border-cream-faint bg-cream-faint" : "border-gold/40 bg-gold/5"
              }`}
            >
              <Check size={12} className={muted ? "text-cream-mute" : "text-gold"} />
            </span>
            <span
              className={`text-base leading-relaxed ${
                muted ? "text-cream-mute" : "text-cream-dim"
              } md:text-lg`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </FadeIn>
  );
}
