import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

// Hero accent + lead image per case study. Keyed by `id`.
const META: Record<
  string,
  { accent: "gold" | "teal" | "sage" | "orange"; image: string; eyebrow: string }
> = {
  "accounting-financial-operations-optimization": {
    accent: "gold",
    image:
      "/images/A product manager and software team planning a tech roadmap on digital whiteboard screens, agile sprint boards and UX wireframes visible, sleek tech office or remote work setup, clean modern business .jpg",
    eyebrow: "Case · Accounting",
  },
  "b2b-sales-development-acceleration": {
    accent: "teal",
    image: "/images/Gigmote Asset 5.jpg",
    eyebrow: "Case · B2B SaaS",
  },
  "digital-marketing-performance-efficiency": {
    accent: "orange",
    image: "/images/Gigmote Asset 4.jpg",
    eyebrow: "Case · Marketing",
  },
  "revenue-cycle-management-optimization": {
    accent: "sage",
    image: "/images/Gigmote Asset 3.jpg",
    eyebrow: "Case · Healthcare RCM",
  },
  "integrated-back-office-sales-support-real-estate": {
    accent: "gold",
    image: "/images/Gigmote Asset 1.jpg",
    eyebrow: "Case · Real estate",
  },
};

export function generateStaticParams() {
  return siteContent.caseStudies.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = siteContent.caseStudies.find((x) => x.id === id);
  if (!c) return { title: "Case study" };
  return { title: c.title, description: c.challenge.slice(0, 160) };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = siteContent.caseStudies.find((x) => x.id === id);
  if (!c) notFound();

  const meta = META[c.id] ?? { accent: "gold", image: "/images/Gigmote Asset 5.jpg", eyebrow: "Case" };
  const idx = siteContent.caseStudies.findIndex((x) => x.id === c.id);
  const nextCase =
    siteContent.caseStudies[(idx + 1) % siteContent.caseStudies.length];

  return (
    <>
      <PageHero
        eyebrow={meta.eyebrow}
        title={c.title}
        subtitle={c.industry}
        accent={meta.accent}
      />

      {/* Hero photo */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn>
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-cream-line">
              <Image
                src={meta.image}
                alt={c.industry}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
              />
              <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                    {meta.eyebrow}
                  </div>
                  <div className="mt-2 font-display text-2xl leading-tight tracking-tight text-cream md:text-3xl">
                    {c.industry}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Challenge → Solution → Results, editorial split */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            {/* Sticky sidebar — phase index */}
            <aside className="md:col-span-3">
              <div className="md:sticky md:top-32 space-y-6">
                <div>
                  <div className="label-eyebrow">— Engagement</div>
                  <div className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
                    {String(idx + 1).padStart(2, "0")}
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-cream-mute ml-2">
                      / 0{siteContent.caseStudies.length}
                    </span>
                  </div>
                </div>
                <div className="hairline" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-cream-mute">
                    Vertical
                  </div>
                  <div className="mt-1 text-sm text-cream">{c.industry}</div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="md:col-span-9 space-y-16 md:space-y-24">
              <Block label="The challenge" body={c.challenge} />
              <Block label="The solution" body={c.solution} />

              {/* Results */}
              <FadeIn>
                <div className="label-eyebrow mb-5">— The results</div>
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
                  {c.results.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 bg-ink-2 p-6 md:p-8"
                    >
                      <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/5">
                        <Check size={12} className="text-gold" />
                      </span>
                      <span className="text-sm leading-relaxed text-cream md:text-base">
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <section className="relative border-b border-cream-line bg-ink py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <Link
            href="/case-studies"
            data-cursor="link"
            className="group inline-flex items-center gap-2 rounded-full border border-cream-faint px-5 py-2.5 text-sm text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            All case studies
          </Link>

          <Link
            href={`/case-studies/${nextCase.id}`}
            data-cursor="magnet"
            className="group flex flex-col items-start gap-1 text-right md:items-end"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-mute">
              Next case study
            </span>
            <span className="inline-flex items-center gap-2 font-display text-lg leading-tight tracking-tight md:text-2xl">
              {nextCase.title}
              <ArrowUpRight
                size={16}
                className="text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Link>
        </div>
      </section>

      <CTABlock />
    </>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <FadeIn>
      <div className="label-eyebrow mb-5">— {label}</div>
      <p className="text-base leading-relaxed text-cream-dim md:text-lg">
        {body}
      </p>
    </FadeIn>
  );
}
