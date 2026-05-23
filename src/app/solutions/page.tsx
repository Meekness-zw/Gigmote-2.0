import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { CTABlock } from "@/components/sections/CTABlock";
import { siteContent } from "@/data/content";

export const metadata = {
  title: "Solutions",
  description:
    "End-to-end operational solutions: global staffing, AI deployments, and BPO advisory — combined into one integrated operating model.",
};

const STACK = [
  {
    layer: "01 · Talent layer",
    body: "Pre-vetted operators placed long-term. Full accountability, KPI-aligned, governance baked in from week one.",
    accent: "border-teal/40 bg-teal/5 text-teal",
  },
  {
    layer: "02 · Process layer",
    body: "Operating model design, SLAs, QA cadence, dashboards. The governance the human team operates inside.",
    accent: "border-gold/40 bg-gold/5 text-gold",
  },
  {
    layer: "03 · AI layer",
    body: "Agents and automation that augment the human team — reducing repetitive load without compromising quality.",
    accent: "border-orange/40 bg-orange/5 text-orange",
  },
];

const OUTCOMES = [
  { value: "50%", label: "Avg cost reduction" },
  { value: "30 d", label: "Time-to-productivity" },
  { value: "94%", label: "Client CSAT" },
  { value: "24/7", label: "Global coverage" },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="One operating system. Three layers. Real outcomes."
        subtitle="End-to-end solutions for operations that need to scale without breaking. Talent, process, and AI — engineered to compound."
        scene="flow"
      />

      {/* Outcomes strip */}
      <section className="relative border-b border-cream-line bg-ink py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-4">
            {OUTCOMES.map((o) => (
              <div key={o.label} className="bg-ink-2 p-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  {o.label}
                </div>
                <div className="mt-1 font-display text-3xl tracking-tight text-gold">
                  {o.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The stack */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— The stack</div>
            <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
              Three layers. Sequenced for compounding effect.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg">
              We never lead with the AI. The human team comes first, the
              governance comes second, and automation layers in only once
              the operating model is stable.
            </p>
          </FadeIn>

          <div className="space-y-4">
            {STACK.map((s, i) => (
              <FadeIn key={s.layer} delay={i * 0.06}>
                <div className="grid grid-cols-1 items-start gap-6 rounded-3xl border border-cream-line bg-ink-2 p-8 md:grid-cols-[260px_1fr] md:gap-10 md:p-10">
                  <div
                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${s.accent}`}
                  >
                    {s.layer}
                  </div>
                  <p className="text-base leading-relaxed text-cream-dim md:text-lg">
                    {s.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities — link out to each service */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— Capabilities</div>
            <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-5xl">
              Pick your wedge.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg">
              Every engagement starts focused. Choose the layer that maps
              to your highest-leverage constraint right now, prove the
              model, then expand.
            </p>
          </FadeIn>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
            {siteContent.services.map((s, i) => (
              <FadeIn key={s.slug} delay={i * 0.05}>
                <Link
                  href={`/services/${s.slug}`}
                  data-cursor="link"
                  className="group flex h-full flex-col gap-5 bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.18em] text-gold">
                      0{i + 1}
                    </span>
                    <s.icon size={18} className="text-cream-mute transition-colors group-hover:text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                      {s.title}
                    </h3>
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                      {s.slogan}
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {s.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-cream-dim">
                        <Check size={12} className="mt-1 shrink-0 text-gold" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between border-t border-cream-line pt-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                      {s.pricing}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-cream-dim transition-colors group-hover:text-gold">
                      Explore
                      <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button href="/contact" variant="primary" size="lg">
              Scope your engagement
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
