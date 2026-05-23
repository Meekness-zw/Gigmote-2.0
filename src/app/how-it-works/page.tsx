import { PageHero } from "@/components/sections/PageHero";
import { ProcessJourney } from "@/components/sections/ProcessJourney";
import { ResultsBlock } from "@/components/sections/ResultsBlock";
import { CTABlock } from "@/components/sections/CTABlock";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata = {
  title: "How it works",
  description:
    "Audit. Match. Integrate. Scale. A four-phase blueprint that takes you from operating-model diagnosis to AI-augmented production teams.",
};

const PROMISES = [
  {
    label: "Evidence first",
    body: "Every engagement starts with diagnosis, not deck. We map your operating constraints before we recommend a single hire or tool.",
  },
  {
    label: "Wedge → expand",
    body: "We start with one measurable function. Prove the model. Then expand into adjacent workstreams as evidence compounds.",
  },
  {
    label: "Human + AI",
    body: "Talent forms the base. Automation layers in once the operating model is stable. Trust before scale.",
  },
  {
    label: "Metrics-driven",
    body: "Dashboards, SLAs, and QA cadence are standard from day one — not optional, not bolted on later.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Four phases. One operating system."
        subtitle="A blueprint that takes you from operating-model diagnosis to AI-augmented production teams — in a cadence the business can absorb."
        scene="flow"
      />

      <ProcessJourney />

      {/* Key promises */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— Key promises</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
              The standards we hold ourselves to.
            </h2>
          </FadeIn>

          <ol className="space-y-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line">
            {PROMISES.map((p, i) => (
              <FadeIn key={p.label} delay={i * 0.06}>
                <li className="grid grid-cols-1 gap-4 bg-ink-2 px-6 py-8 md:grid-cols-[120px_220px_1fr] md:gap-10 md:px-10">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                    0{i + 1} / 04
                  </div>
                  <div className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {p.label}
                  </div>
                  <p className="text-sm leading-relaxed text-cream-dim md:text-base">
                    {p.body}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      <ResultsBlock />
      <CTABlock />
    </>
  );
}
