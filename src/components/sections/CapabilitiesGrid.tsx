"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const CAPS = [
  {
    no: "01",
    title: "AI & Technical Talent Sourcing",
    href: "/services/global-staffing",
    body:
      "Pre-vetted AI engineers, AML/KYC compliance ops, data scientists, ML-ops specialists, and senior technical operators — placed with precision, onboarded with rigour, accountable from day one. Not a marketplace. A placement model built on performance.",
    tag: "Placement",
  },
  {
    no: "02",
    title: "Intelligent Workflow Deployment",
    href: "/services/ai-business-solutions",
    body:
      "AI agents, data pipelines, and automation architecture designed to reduce operational load without compromising quality or control. Built for teams that run on outcomes, not headcount.",
    tag: "AI systems",
  },
  {
    no: "03",
    title: "Technical BPO Advisory",
    href: "/services/bpo-advisory",
    body:
      "For organizations outsourcing technical and non-technical functions, we design the operating model before a single hire is made. Vendor selection, SLAs, QA frameworks, and performance governance included.",
    tag: "Advisory",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="relative border-b border-cream-line bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 max-w-3xl md:mb-24">
          <div className="label-eyebrow mb-5">— What we do</div>
          <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
            <SplitText
              text="Two capabilities. One integrated model."
              stagger={0.05}
            />
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg">
            Gigmote operates at the intersection of technical talent and
            intelligent infrastructure — sourcing the engineers, compliance
            operators, and data scientists who define competitive advantage,
            then deploying the automation systems that make them operate at
            full leverage.
          </p>
        </FadeIn>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line md:grid-cols-3">
          {CAPS.map((c, idx) => (
            <FadeIn key={c.no} delay={idx * 0.08}>
              <Link
                href={c.href}
                data-cursor="link"
                className="group relative flex h-full flex-col gap-6 bg-ink-2 p-8 transition-colors hover:bg-ink-3 md:p-10"
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 0%, rgba(246,206,72,0.08), transparent 60%)",
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.18em] text-gold">
                    {c.no}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-mute">
                    {c.tag}
                  </span>
                </div>

                <h3 className="relative font-display text-2xl leading-tight tracking-tight md:text-3xl">
                  {c.title}
                </h3>

                <p className="relative text-sm leading-relaxed text-cream-dim md:text-[15px]">
                  {c.body}
                </p>

                <div className="relative mt-auto flex items-center gap-2 text-sm text-cream-dim transition-colors group-hover:text-gold">
                  <span>Read more</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
