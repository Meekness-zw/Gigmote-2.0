import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/sections/ContactForm";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Hire a Developer",
  description:
    "From brief to bench in 14 days. Direct intake flow for vetted technical talent placements — AI engineers, full-stack, data, ML-ops.",
};

const HIRES = [
  "AI Engineers (LLM-native)",
  "Full-stack Engineers",
  "Data Scientists / ML-ops",
  "DevOps / SRE",
  "Senior Backend Engineers",
  "Technical Product Managers",
];

const STEPS = [
  { n: "01", title: "Brief intake", body: "30-min scoping call to understand stack, seniority, and timeline." },
  { n: "02", title: "Curated shortlist", body: "3–5 pre-vetted candidates within 7 days, matched to your KPIs." },
  { n: "03", title: "Trial sprint", body: "Optional 2-week paid trial before commitment. No risk." },
  { n: "04", title: "Onboarding", body: "We handle paperwork, IP, security. You handle the work." },
];

export default function HireADevPage() {
  return (
    <>
      <PageHero
        eyebrow="Hire a Dev"
        title="From brief to bench in 14 days."
        subtitle="Direct intake flow for vetted technical talent. AI engineers, full-stack, data, ML-ops, DevOps — placed long-term, managed end-to-end."
        scene="network"
      />

      {/* Roles we place */}
      <section className="relative border-b border-cream-line bg-ink py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-12 max-w-3xl">
            <div className="label-eyebrow mb-5">— Roles we place</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
              The technical bench.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line sm:grid-cols-2 lg:grid-cols-3">
            {HIRES.map((h, i) => (
              <FadeIn key={h} delay={(i % 3) * 0.05}>
                <div className="flex items-center gap-3 bg-ink-2 p-6">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-gold/5">
                    <Check size={12} className="text-gold" />
                  </span>
                  <span className="text-sm font-medium text-cream">{h}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-12 max-w-2xl">
            <div className="label-eyebrow mb-5">— Engagement flow</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
              Four steps. Fourteen days.
            </h2>
          </FadeIn>

          <ol className="space-y-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.06}>
                <li className="grid grid-cols-1 gap-4 bg-ink-2 px-6 py-7 md:grid-cols-[120px_220px_1fr] md:gap-10 md:px-10">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                    {s.n} / 04
                  </div>
                  <div className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {s.title}
                  </div>
                  <p className="text-sm leading-relaxed text-cream-dim md:text-base">
                    {s.body}
                  </p>
                </li>
              </FadeIn>
            ))}
          </ol>

          <div className="mt-12 flex justify-center">
            <Button href="#contact" variant="primary" size="lg">
              Start the brief
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact form (anchored) */}
      <div id="contact">
        <ContactForm />
      </div>

      <CTABlock />
    </>
  );
}
