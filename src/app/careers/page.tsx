import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Careers",
  description:
    "Join the future of work. AI engineers, technical operators, compliance specialists, and BPO leaders building global teams that compound impact.",
};

const REASONS = [
  {
    label: "Performance, not politics",
    body: "We hire and promote by what you ship, not who you know. KPIs are visible. Wins are measurable.",
  },
  {
    label: "Operator-led culture",
    body: "Everyone on the team has built or run operations. No pure managers, no pure recruiters. Doers all the way down.",
  },
  {
    label: "Real work, real outcomes",
    body: "Long-term placements with serious clients — not freelance gigs. You own a function and you see the impact.",
  },
  {
    label: "Tools + autonomy",
    body: "AI-augmented workflows from day one. Less repetitive load. More high-leverage decision-making.",
  },
];

const ROLES = [
  { title: "AI Engineers", desc: "Build the agents that augment the human team.", area: "AI & Engineering" },
  { title: "AML / KYC Compliance Ops", desc: "Run regulated workstreams for our FinTech clients.", area: "Compliance" },
  { title: "Data Scientists", desc: "Drive analytics that close the loop on operations.", area: "AI & Engineering" },
  { title: "Senior Customer Success Leads", desc: "Anchor strategic accounts across SaaS engagements.", area: "CX" },
  { title: "SDRs & Pipeline Operators", desc: "Build outbound machines for B2B SaaS founders.", area: "Sales" },
  { title: "Accounting & Financial Operators", desc: "Run month-end close and FP&A workflows for US clients.", area: "Finance" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join the future of work."
        subtitle="We're building a global bench of AI engineers, technical operators, compliance specialists, and BPO leaders. If you operate at the intersection of performance and craft — we want to talk."
        scene="constellation"
      />

      {/* Why work with us */}
      <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-16 max-w-3xl">
            <div className="label-eyebrow mb-5">— Why Gigmote</div>
            <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
              Built for operators who want to build operators.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-2">
            {REASONS.map((r, i) => (
              <FadeIn key={r.label} delay={i * 0.06}>
                <div className="flex h-full flex-col gap-3 bg-ink-2 p-8">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-gold">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {r.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-cream-dim">{r.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="mb-12 flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="label-eyebrow mb-5">— Open roles</div>
              <h2 className="font-display text-3xl leading-[1.04] tracking-tighter md:text-5xl">
                The bench we're building.
              </h2>
            </div>
            <Link
              href="/join-gigmote"
              data-cursor="magnet"
              className="hidden rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-[#0F0F12] hover:scale-[1.02] transition-transform md:inline-flex md:items-center md:gap-2"
            >
              Apply now
              <ArrowRight size={14} />
            </Link>
          </FadeIn>

          <div className="divide-y divide-cream-line border-y border-cream-line">
            {ROLES.map((role, i) => (
              <FadeIn key={role.title} delay={i * 0.04}>
                <Link
                  href="/join-gigmote"
                  data-cursor="link"
                  className="group grid grid-cols-1 gap-3 py-6 md:grid-cols-[1fr_300px_120px] md:items-center md:gap-8 md:py-7"
                >
                  <div>
                    <div className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                      {role.title}
                    </div>
                    <div className="mt-1 text-sm text-cream-dim">{role.desc}</div>
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                    {role.area}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold md:justify-end">
                    Apply
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <Button href="/join-gigmote" variant="primary" size="lg">
              Apply now
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
