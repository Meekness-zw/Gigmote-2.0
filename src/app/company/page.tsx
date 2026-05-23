import { Target, Users, Zap, Globe, Award, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

export const metadata = {
  title: "Company",
  description:
    "Deep CX, FinTech, and SaaS experience. Metrics-driven, process-first delivery. Human + AI. The Gigmote standard.",
};

const VALUES = [
  {
    icon: Target,
    title: "Performance first",
    body: "We measure success by outcomes, not hours. Every team member is accountable to clear KPIs.",
  },
  {
    icon: Users,
    title: "Human-centric",
    body: "Technology enables us, but people drive results. We invest in training, culture, and retention.",
  },
  {
    icon: Zap,
    title: "Move fast",
    body: "Speed is a competitive advantage. We launch teams in weeks, not months.",
  },
  {
    icon: Globe,
    title: "Globally minded",
    body: "Talent has no borders. We build diverse teams that bring unique perspectives.",
  },
  {
    icon: Award,
    title: "Craft over scale",
    body: "We'd rather run 30 great engagements than 300 mediocre ones. Quality is the moat.",
  },
  {
    icon: TrendingUp,
    title: "Compound, don't churn",
    body: "Long-term placements with serious accountability. We're not in the transactional placement game.",
  },
];

const TIMELINE = [
  {
    phase: "The problem",
    year: "2018",
    body:
      "Watched too many outsourcing engagements fail — not from bad talent, but from bad design. Recruiters placing résumés, BPOs running on volume, no one owning the operating model.",
  },
  {
    phase: "The pattern",
    year: "2020",
    body:
      "Across CX, FinTech, and SaaS engagements, the same failure modes kept showing up. Volume over quality. Hype-driven AI. Opaque pricing. No QA cadence. We started documenting it.",
  },
  {
    phase: "The model",
    year: "2022",
    body:
      "Built the operating-model-first approach: diagnose before recommend, wedge before scale, evidence before promises. Tested it across five sectors, watched it work.",
  },
  {
    phase: "Gigmote",
    year: "2024",
    body:
      "Productized the model. Three capabilities, one operating system. Global bench, AI layer, BPO advisory — all sequenced so each phase compounds the next.",
  },
];

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Built by operators who have built BPOs and shipped AI systems."
        subtitle={siteContent.company.heroDescription}
        scene="rings"
      />

      {/* Stats */}
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

      {/* Values */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— Our values</div>
            <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
              <SplitText
                text="Six things we won't compromise on."
                stagger={0.05}
              />
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeIn key={v.title} delay={(i % 3) * 0.06}>
                  <div className="flex h-full flex-col gap-4 bg-ink-2 p-8">
                    <Icon size={20} className="text-gold" />
                    <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                      {v.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-cream-dim">
                      {v.body}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— Our story</div>
            <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
              <SplitText text="Six years of pattern recognition." stagger={0.05} />
            </h2>
          </FadeIn>

          <ol className="space-y-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line">
            {TIMELINE.map((t, i) => (
              <FadeIn key={t.phase} delay={i * 0.06}>
                <li className="grid grid-cols-1 gap-4 bg-ink-2 px-6 py-8 md:grid-cols-[140px_220px_1fr] md:gap-10 md:px-10">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                    {t.year}
                  </div>
                  <div className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {t.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-cream-dim md:text-base">
                    {t.body}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
