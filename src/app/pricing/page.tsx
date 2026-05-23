import { Check, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { ROICalculator } from "@/components/sections/ROICalculator";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Pricing",
  description:
    "Transparent pricing across global staffing, AI business solutions, and BPO advisory. Pilot first. Scale with evidence.",
};

const TIERS = [
  {
    name: "Global Staffing",
    badge: "Per role",
    headline: "From $9/hr",
    sub: "Curated, long-term remote talent",
    body: "Full-time vetted professionals onboarded with KPIs, governance, and metrics-led oversight. Not body-shopping.",
    bullets: [
      "Full-time placement, long-term retention focus",
      "Pre-vetted across technical & soft skills",
      "Timezone alignment (UK / NA)",
      "KPI dashboards + QA cadence",
      "Optional managed oversight layer",
    ],
    cta: { label: "Start a placement", href: "/contact" },
    featured: false,
  },
  {
    name: "AI Business Solutions",
    badge: "Per deployment",
    headline: "From $3,000",
    sub: "Practical AI that augments teams",
    body: "Chatbots, agents, automation pipelines deployed to reduce repetitive load without compromising quality or control.",
    bullets: [
      "Support & lead-capture chatbots",
      "Internal helpdesk + knowledge bots",
      "Ops automation agents (triage, tagging, routing)",
      "Finance + sales workflow agents",
      "Human-in-the-loop where it matters",
    ],
    cta: { label: "Scope a deployment", href: "/contact" },
    featured: true,
  },
  {
    name: "BPO Advisory",
    badge: "Engagement",
    headline: "Custom",
    sub: "Designed before a single hire",
    body: "Outsourcing strategy, operating model, vendor selection, SLAs, QA frameworks — for organisations that need the design done right.",
    bullets: [
      "BPO strategy + vendor selection",
      "Operating model design (pods, SLAs, QA)",
      "Transition + onboarding playbooks",
      "Performance optimisation (CSAT, FCR, CTS)",
      "Optimisation of existing BPO relationships",
    ],
    cta: { label: "Book an advisory call", href: "/contact" },
    featured: false,
  },
];

const FAQ = [
  {
    q: "What's the engagement cadence?",
    a: "Pilot (30–60 days) → scale → optimise. We start with a focused wedge, prove the model, then expand into adjacent functions.",
  },
  {
    q: "Do you charge for the design phase?",
    a: "Advisory is scoped per engagement. Staffing and AI projects bundle the operating-model design into the first 30 days at no separate fee.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "No annual lock-in. Staffing operates on a month-to-month basis. AI deployments are project-priced with optional support retainers.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent. Outcome-aligned."
        subtitle="Three pricing structures matched to three delivery models. Pilot first. Scale with evidence."
        scene="grid"
      />

      {/* Pricing cards */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line lg:grid-cols-3">
            {TIERS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.06}>
                <div
                  className={`relative flex h-full flex-col gap-6 p-8 md:p-10 ${
                    t.featured ? "bg-ink-3" : "bg-ink-2"
                  }`}
                >
                  {t.featured && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 0%, rgba(246,206,72,0.10), transparent 60%)",
                      }}
                    />
                  )}

                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                      {t.badge}
                    </span>
                    {t.featured && (
                      <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                        Most flexible
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <h3 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">
                      {t.name}
                    </h3>
                    <div className="mt-2 text-sm text-cream-mute">{t.sub}</div>
                  </div>

                  <div className="relative">
                    <div className="font-display text-4xl leading-none tracking-tighter text-cream md:text-5xl">
                      {t.headline}
                    </div>
                  </div>

                  <p className="relative text-sm leading-relaxed text-cream-dim">
                    {t.body}
                  </p>

                  <ul className="relative space-y-3 border-t border-cream-line pt-6">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <Check size={14} className="mt-1 shrink-0 text-gold" />
                        <span className="text-sm leading-relaxed text-cream-dim">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto pt-6">
                    <Button
                      href={t.cta.href}
                      variant={t.featured ? "primary" : "outline"}
                      size="md"
                      className="w-full"
                    >
                      {t.cta.label}
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator (reused) */}
      <ROICalculator />

      {/* Pricing FAQ */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn className="mb-12 max-w-2xl">
            <div className="label-eyebrow mb-5">— Pricing FAQ</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-4xl">
              Questions that come up before a contract.
            </h2>
          </FadeIn>
          <div className="divide-y divide-cream-line border-y border-cream-line">
            {FAQ.map((f, i) => (
              <FadeIn key={f.q} delay={i * 0.05}>
                <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[280px_1fr] md:gap-12">
                  <div className="font-display text-lg leading-tight tracking-tight md:text-xl">
                    {f.q}
                  </div>
                  <p className="text-sm leading-relaxed text-cream-dim md:text-base">
                    {f.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
