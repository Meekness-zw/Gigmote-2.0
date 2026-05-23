import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";
import { CTABlock } from "@/components/sections/CTABlock";
import { ComparisonBlock } from "@/components/sections/ComparisonBlock";
import { PositionBlock } from "@/components/sections/PositionBlock";
import { ResultsBlock } from "@/components/sections/ResultsBlock";
import { siteContent } from "@/data/content";

export const metadata = {
  title: "About",
  description:
    "Built by operators who have built BPOs and shipped AI systems. Our model combines high-quality remote talent, proven BPO strategy, and practical AI.",
};

const FAILURES = [
  {
    label: "Volume over quality",
    body: "Marketplaces ship volume but cannot enforce performance — and 'pay-per-task' breaks the moment your operation crosses 10 people.",
  },
  {
    label: "Recruitment-led models",
    body: "Built by recruiters with no operations background — they place résumés, not capabilities. The model collapses the moment the work gets technical.",
  },
  {
    label: "Hype-driven AI",
    body: "AI bolted on after staffing, sold as a feature, not engineered as a system. Trust breaks at the first edge case the bot can't handle.",
  },
  {
    label: "Opaque pricing & no QA",
    body: "Pricing that drifts. QA cadence that doesn't exist. SLAs without dashboards. The operator never gets a clean read on what's actually being delivered.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built by operators, not recruiters."
        subtitle={siteContent.about.heroDescription}
        scene="rings"
      />

      {/* Stats strip from company.stats */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
            {siteContent.company.stats.map((s) => (
              <div key={s.label} className="bg-ink-2 p-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-2xl tracking-tight text-gold md:text-3xl">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why traditional outsourcing fails */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— What we kept hitting</div>
            <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
              <SplitText
                text="Why traditional outsourcing fails."
                stagger={0.05}
              />
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg">
              Before Gigmote, we ran the operations. We watched these failure
              modes repeat across CX, FinTech, and SaaS engagements. The
              standard we hold ourselves to is a direct response to each one.
            </p>
          </FadeIn>

          <ol className="space-y-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line">
            {FAILURES.map((f, i) => (
              <FadeIn key={f.label} delay={i * 0.06}>
                <li className="grid grid-cols-1 gap-4 bg-ink-2 px-6 py-7 md:grid-cols-[120px_220px_1fr] md:gap-10 md:px-10 md:py-9">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream-mute">
                    0{i + 1} / 04
                  </div>
                  <div className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {f.label}
                  </div>
                  <p className="text-sm leading-relaxed text-cream-dim md:text-base">
                    {f.body}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* Position block (reused) */}
      <PositionBlock />

      {/* Comparison block (reused) */}
      <ComparisonBlock />

      {/* Results (reused) */}
      <ResultsBlock />

      <CTABlock />
    </>
  );
}
