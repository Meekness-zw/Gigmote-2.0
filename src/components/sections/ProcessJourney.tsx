"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsSmallViewport } from "@/lib/useIsSmallViewport";

const ProcessScene3D = dynamic(
  () =>
    import("@/components/three/ProcessScene3D").then((m) => m.ProcessScene3D),
  { ssr: false, loading: () => null }
);

import { setProcessProgress } from "@/components/three/ProcessScene3D";

const STEPS = [
  {
    no: "01",
    title: "Operational audit",
    body:
      "We diagnose your operating model — workflows, hand-offs, SLAs, talent gaps — before recommending a single hire or tool. Evidence comes before action.",
    chips: ["Workflows", "SLAs", "Bottlenecks", "Risk"],
  },
  {
    no: "02",
    title: "Precision match",
    body:
      "Pre-vetted operators or curated BPO partners assembled around your KPIs. Not résumé matching. Performance matching, end-to-end accountable.",
    chips: ["Vetted talent", "Long-term", "KPI-aligned"],
  },
  {
    no: "03",
    title: "Managed integration",
    body:
      "Structured pilots, dashboards, QA cadence, and SLAs from week one — so the team operates inside your governance, not parallel to it.",
    chips: ["Dashboards", "QA cadence", "Governance"],
  },
  {
    no: "04",
    title: "Scale & optimise",
    body:
      "AI agents and workflow automation layer in once the human team is stable. Expand the engagement with evidence — not promises.",
    chips: ["AI agents", "Automation", "Continuous"],
  },
];

export function ProcessJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const reduced = useReducedMotion();
  const isSmall = useIsSmallViewport();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // RAF-coalesced scroll handler. Without this the listener ran 60+ times
    // per second, each call computing getBoundingClientRect + a setState —
    // which was a sizeable contributor to the "dragging" on scroll-up.
    let raf = 0;
    let lastIdx = -1;
    const update = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const passed = Math.min(Math.max(-r.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      setProcessProgress(p);
      const idx = Math.min(
        STEPS.length - 1,
        Math.max(0, Math.floor(p * STEPS.length))
      );
      // Only flip React state when the bucket actually changes — saves
      // ~3 renders per second of normal scrolling.
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActiveIdx(idx);
      }
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Reduced-motion or small-viewport fallback — render the four phases as
  // a static vertical list. No scroll-jacking, no WebGL. Same content,
  // calmer surface for screen readers and phones.
  if (reduced || isSmall) {
    return (
      <section className="relative border-b border-cream-line bg-ink-1 py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="label-eyebrow mb-5">— How we work</div>
            <h2 className="font-display text-4xl leading-[1.02] tracking-tighter md:text-6xl">
              From audit to operating system.
            </h2>
          </div>
          <ol className="space-y-px overflow-hidden rounded-3xl border border-cream-line bg-cream-line">
            {STEPS.map((s) => (
              <li
                key={s.no}
                className="grid grid-cols-1 gap-4 bg-ink-2 px-6 py-8 md:grid-cols-[120px_220px_1fr] md:gap-10 md:px-10"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
                  {s.no} / 04
                </div>
                <div className="font-display text-xl leading-tight tracking-tight md:text-2xl">
                  {s.title}
                </div>
                <p className="text-sm leading-relaxed text-cream-dim md:text-base">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink-1"
      // 65vh per phase instead of 100vh. With 4 phases that's a 260vh pin,
      // shorter scroll-back-up distance and less compositor work spent
      // inside the pinned section. Visuals still scrub fully through the
      // 3D scene because the camera path is normalised over the section.
      style={{ height: `${STEPS.length * 65}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D scene fills the whole pinned viewport */}
        <div className="absolute inset-0">
          <ProcessScene3D className="h-full w-full" />
        </div>

        {/* Vignette to anchor the text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 50% at 50% 60%, transparent 0%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.92) 100%)",
          }}
        />

        {/* Foreground content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-6 pt-28 pb-12 md:pt-36">
          {/* Top eyebrow + section title */}
          <FadeIn className="max-w-2xl">
            <div className="label-eyebrow mb-5">— How we work</div>
            <h2 className="font-display text-4xl leading-[1.02] tracking-tighter md:text-6xl">
              <SplitText text="From audit to operating system." stagger={0.05} />
            </h2>
          </FadeIn>

          {/* Active phase panel — bottom anchored */}
          <div className="mt-auto grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            {/* Phase indicator */}
            <div className="md:col-span-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                The Gigmote Blueprint
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-5xl tracking-tight text-cream md:text-6xl tabular-nums">
                  {STEPS[activeIdx].no}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-cream-mute">
                  / 04
                </span>
              </div>

              {/* Step dots */}
              <div className="mt-4 flex gap-2">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i <= activeIdx
                        ? "w-8 bg-gold"
                        : "w-4 bg-cream-faint"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Phase title */}
            <motion.div
              key={`title-${activeIdx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4"
            >
              <h3 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                {STEPS[activeIdx].title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {STEPS[activeIdx].chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-gold"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Phase body */}
            <motion.div
              key={`body-${activeIdx}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5"
            >
              <p className="text-base leading-relaxed text-cream-dim md:text-lg">
                {STEPS[activeIdx].body}
              </p>
            </motion.div>
          </div>

          {/* Hairline */}
          <div className="hairline mt-10" />

          {/* Scroll hint */}
          <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-cream-mute">
            <span>Phase progression</span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 animate-pulse rounded-full bg-gold" />
              Keep scrolling
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
