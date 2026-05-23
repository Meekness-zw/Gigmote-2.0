import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABlock } from "@/components/sections/CTABlock";

export const metadata = {
  title: "Resources",
  description:
    "Playbooks, frameworks, and field notes — operational templates, BPO scorecards, and AI deployment patterns from real engagements.",
};

const RESOURCES = [
  {
    type: "Playbook",
    title: "The 30-day BPO pilot scorecard",
    body: "What to measure in week 1, week 2, week 4. The exact dashboard we use on every BPO advisory engagement.",
    cta: "Read playbook",
  },
  {
    type: "Framework",
    title: "Operating model design for outsourced ops",
    body: "Pod architecture, SLA tiers, QA cadence, and KPI ladders. The 4-layer framework behind every Gigmote engagement.",
    cta: "Read framework",
  },
  {
    type: "Template",
    title: "Vendor selection rubric (SaaS edition)",
    body: "The 12-criteria scorecard we use to evaluate BPO vendors. Includes scoring sheet and red-flag checklist.",
    cta: "Download template",
  },
  {
    type: "Field note",
    title: "Why we don't deploy AI before the human team is stable",
    body: "Pattern recognition from 5 engagements: AI bolted on too early breaks trust. Here's the cadence that works instead.",
    cta: "Read field note",
  },
  {
    type: "Playbook",
    title: "Healthcare RCM — denial reduction in 90 days",
    body: "The exact denial-management cadence that took one practice from 18% denial rate to 7% in three months.",
    cta: "Read playbook",
  },
  {
    type: "Framework",
    title: "Hiring offshore SDR teams that actually convert",
    body: "Vetting questions, KPI structure, ramp curve, and the three traps that kill outsourced SDR programs.",
    cta: "Read framework",
  },
];

const TYPE_COLOR: Record<string, string> = {
  Playbook: "text-gold border-gold/40 bg-gold/5",
  Framework: "text-teal border-teal/40 bg-teal/5",
  Template: "text-sage border-sage/40 bg-sage/5",
  "Field note": "text-orange border-orange/40 bg-orange/5",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Playbooks, frameworks, and field notes."
        subtitle="Operational templates, BPO scorecards, and AI deployment patterns from real engagements. Library expands as we run new playbooks in production."
        scene="flow"
      />

      <section className="relative border-b border-cream-line bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => (
              <FadeIn key={r.title} delay={(i % 3) * 0.06}>
                <Link
                  href="/contact"
                  data-cursor="link"
                  className="group relative flex h-full flex-col gap-5 bg-ink-2 p-8 transition-colors hover:bg-ink-3"
                >
                  <span
                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
                      TYPE_COLOR[r.type] ?? "text-gold border-gold/40 bg-gold/5"
                    }`}
                  >
                    {r.type}
                  </span>

                  <h3 className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                    {r.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-cream-dim">{r.body}</p>

                  <div className="mt-auto flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                    {r.cta}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-16 text-center">
            <p className="mx-auto max-w-xl text-sm text-cream-mute">
              Full resource library lands shortly. In the meantime — ask us
              about any of these and we'll send the underlying material
              directly.
            </p>
          </FadeIn>
        </div>
      </section>

      <CTABlock />
    </>
  );
}
