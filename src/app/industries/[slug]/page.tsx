import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

export function generateStaticParams() {
  return siteContent.industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = siteContent.industries.find((x) => x.slug === slug);
  if (!ind) return { title: "Industry" };
  return { title: ind.title, description: ind.description };
}

const INDUSTRY_ACCENTS: Record<string, "gold" | "teal" | "sage" | "orange"> = {
  healthcare: "sage",
  saas: "teal",
  "it-web3": "gold",
  "digital-marketing": "orange",
  "sales-enablement": "gold",
  fintech: "teal",
};

const INDUSTRY_FOCUS: Record<string, string[]> = {
  healthcare: [
    "Revenue cycle management",
    "Prior authorisations & claim scrubbing",
    "Patient communication & intake",
    "Compliance & HIPAA-aware operations",
    "Denial analytics & A/R recovery",
  ],
  saas: [
    "Customer success operations",
    "Onboarding & implementation",
    "Tier-1 / Tier-2 technical support",
    "Renewal & retention plays",
    "Revenue operations (RevOps)",
  ],
  "it-web3": [
    "Development support & QA",
    "Service management (L1 / L2)",
    "Incident response & monitoring",
    "Infrastructure scaling & DevOps",
    "Smart contract operations (Web3-native)",
  ],
  "digital-marketing": [
    "Performance media management",
    "Content production & calendars",
    "Marketing operations & reporting",
    "Lifecycle & email orchestration",
    "Funnel analytics & attribution",
  ],
  "sales-enablement": [
    "Outbound SDR teams",
    "Inbound lead qualification",
    "CRM hygiene & RevOps",
    "Proposal & RFP development",
    "Pipeline forecasting cadence",
  ],
  fintech: [
    "AML / KYC operations",
    "Transaction monitoring",
    "Compliance reviews & escalations",
    "Customer due diligence",
    "Risk-aware customer support",
  ],
};

const INDUSTRY_OUTCOMES: Record<string, Array<{ v: string; l: string }>> = {
  healthcare: [
    { v: "−61%", l: "Denial rate" },
    { v: "40%", l: "A/R reduction" },
    { v: "+$220K", l: "Monthly cash flow" },
  ],
  saas: [
    { v: "4×", l: "Pipeline volume" },
    { v: "<24h", l: "Tier-1 response" },
    { v: "+12 pt", l: "NPS lift" },
  ],
  "it-web3": [
    { v: "24/7", l: "Coverage" },
    { v: "−45%", l: "MTTR" },
    { v: "2×", l: "Ship velocity" },
  ],
  "digital-marketing": [
    { v: "−42%", l: "CPL" },
    { v: "3×", l: "Content output" },
    { v: "+55%", l: "Paid ROI" },
  ],
  "sales-enablement": [
    { v: "26", l: "Demos / month" },
    { v: "4×", l: "Outbound activity" },
    { v: "$2.1M", l: "Pipeline added" },
  ],
  fintech: [
    { v: "100%", l: "Audit readiness" },
    { v: "−38%", l: "Review time" },
    { v: "Zero", l: "Compliance gaps" },
  ],
};

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = siteContent.industries.find((i) => i.slug === slug);
  if (!ind) notFound();

  const accent = INDUSTRY_ACCENTS[ind.slug] ?? "gold";
  const focus = INDUSTRY_FOCUS[ind.slug] ?? [];
  const outcomes = INDUSTRY_OUTCOMES[ind.slug] ?? [];
  const others = siteContent.industries.filter((i) => i.slug !== ind.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`Industry · ${ind.title}`}
        title={ind.heroTitle}
        subtitle={ind.description}
        accent={accent}
      />

      {/* Outcomes strip */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
            {outcomes.map((o) => (
              <div key={o.l} className="bg-ink-2 p-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  {o.l}
                </div>
                <div className="mt-1 font-display text-3xl tracking-tight text-gold">
                  {o.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we operate */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <FadeIn>
                <div className="label-eyebrow mb-5">— Where we operate</div>
                <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
                  The functions we run.
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-cream-dim md:text-lg">
                  Inside this vertical, we typically engage on five to seven
                  operational workstreams. Here's the active set.
                </p>
              </FadeIn>
            </div>

            <div className="md:col-span-7">
              <ul className="divide-y divide-cream-line border-y border-cream-line">
                {focus.map((f, i) => (
                  <FadeIn key={f} delay={i * 0.05}>
                    <li className="flex items-start gap-4 py-5">
                      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/5">
                        <Check size={12} className="text-gold" />
                      </span>
                      <span className="text-base leading-relaxed md:text-lg">
                        {f}
                      </span>
                    </li>
                  </FadeIn>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link to relevant services */}
      <section className="relative border-b border-cream-line bg-ink py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-12 max-w-2xl">
            <div className="label-eyebrow mb-5">— Services applied</div>
            <h2 className="font-display text-3xl leading-tight tracking-tighter md:text-4xl">
              How we engage in {ind.title}.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
            {siteContent.services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-cursor="link"
                className="group flex h-full flex-col gap-4 bg-ink-2 p-8 transition-colors hover:bg-ink-3"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-gold">
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream-dim">{s.slogan}</p>
                <div className="mt-auto flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                  Read service
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Other industries */}
      <section className="relative bg-ink-1 border-b border-cream-line py-20">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-10">
            <div className="label-eyebrow">— Other verticals</div>
          </FadeIn>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
            {others.map((o, i) => {
              const Icon = o.icon;
              return (
                <Link
                  key={o.slug}
                  href={`/industries/${o.slug}`}
                  data-cursor="link"
                  className="group flex h-full flex-col gap-4 bg-ink-2 p-8 transition-colors hover:bg-ink-3"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={18} className="text-cream-mute" />
                    <span className="font-mono text-[10px] tracking-[0.18em] text-cream-mute">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {o.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-cream-dim">
                    {o.description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                    Explore
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Button href="/contact" variant="primary" size="lg">
              Scope a {ind.title} engagement
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
