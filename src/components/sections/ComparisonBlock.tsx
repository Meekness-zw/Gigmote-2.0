"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";
import { Check, X } from "lucide-react";

const ROWS: Array<{ label: string; trad: string; pro: string }> = [
  { label: "Model", trad: "Built by recruiters", pro: "Built by operators with real CX, FinTech & SaaS experience" },
  { label: "Talent", trad: "Freelance marketplaces & body-shopping", pro: "Curated, long-term remote talent with full accountability" },
  { label: "BPO Strategy", trad: "No design — just vendor selection", pro: "Full BPO consulting: model design, SLAs, QA & playbooks" },
  { label: "AI", trad: "Hype-driven automation", pro: "AI that augments teams — chatbots, agents & workflow automation" },
  { label: "Oversight", trad: "Minimal reporting & visibility", pro: "Metrics-driven onboarding, KPI dashboards & ongoing optimization" },
  { label: "Pricing", trad: "Opaque and unpredictable", pro: "Transparent pricing: pilot → staffing → consulting → AI" },
];

export function ComparisonBlock() {
  return (
    <section className="relative bg-ink py-24 md:py-36 border-b border-cream-line">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mb-16 max-w-3xl">
          <div className="label-eyebrow mb-5">— Why companies choose us</div>
          <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
            <SplitText text="Traditional outsourcing." stagger={0.05} />
            <span className="block text-gold">
              <SplitText text="Then there's Gigmote." stagger={0.05} />
            </span>
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-2xl border border-cream-line">
            {/* Header row */}
            <div className="hidden grid-cols-[1fr_1fr_1fr] bg-ink-2 md:grid">
              <div className="px-6 py-5 text-xs font-mono uppercase tracking-[0.18em] text-cream-mute">
                Dimension
              </div>
              <div className="border-l border-cream-line px-6 py-5">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-cream-mute">
                  Traditional
                </div>
              </div>
              <div className="border-l border-cream-line bg-gradient-to-b from-gold/10 to-transparent px-6 py-5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Gigmote
                </div>
              </div>
            </div>

            {ROWS.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] ${
                  i === 0 ? "" : "border-t border-cream-line"
                }`}
              >
                <div className="bg-ink-2 px-6 py-5 md:bg-transparent">
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-cream-mute md:hidden">
                    Dimension
                  </div>
                  <div className="text-sm font-medium text-cream">{r.label}</div>
                </div>
                <div className="border-t border-cream-line px-6 py-5 md:border-t-0 md:border-l">
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-cream-mute md:hidden">
                    Traditional
                  </div>
                  <div className="flex items-start gap-3">
                    <X size={14} className="mt-1 shrink-0 text-cream-mute" />
                    <p className="text-sm leading-relaxed text-cream-mute">{r.trad}</p>
                  </div>
                </div>
                <div className="border-t border-cream-line bg-gold/[0.025] px-6 py-5 md:border-t-0 md:border-l">
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-gold md:hidden">
                    Gigmote
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={14} className="mt-1 shrink-0 text-gold" />
                    <p className="text-sm leading-relaxed text-cream">{r.pro}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
