"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsSmallViewport } from "@/lib/useIsSmallViewport";

// WebGL is heavy + client-only; ship it lazily.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const reduced = useReducedMotion();
  const isSmall = useIsSmallViewport();
  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-grain bg-ink"
      data-section="hero"
      data-cursor-halo
    >
      {/* WebGL canvas — fills the whole hero. Replaced by a static gradient
          when the user prefers reduced motion *or* is on a small viewport
          (battery + perf concern on phones). */}
      <div className="absolute inset-0 z-0">
        {reduced || isSmall ? (
          <div
            aria-hidden
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(246,206,72,0.18), transparent 55%), radial-gradient(circle at 30% 70%, rgba(154,210,210,0.10), transparent 55%), #0A0A0B",
            }}
          />
        ) : (
          <HeroScene className="h-full w-full" />
        )}
      </div>

      {/* Vignette gradients to anchor text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.9) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent to-ink"
      />

      {/* Content */}
      <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-6 pt-32 pb-16 md:pt-44 md:pb-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="relative grid h-1.5 w-1.5 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <span className="label-eyebrow">Outsourcing+ · Built by operators</span>
        </motion.div>

        {/* Headline */}
        <h1 className="max-w-[15ch] font-display text-[clamp(2.6rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-tightest text-cream">
          <span className="block">
            <SplitText text="Source the minds" delay={1.85} stagger={0.07} />
          </span>
          <span className="block text-cream-dim">
            <SplitText text="building the future." delay={2.05} stagger={0.07} />
          </span>
          <span className="block mt-3">
            <span className="text-gold">
              <SplitText text="Deploy the systems" delay={2.55} stagger={0.07} />
            </span>
          </span>
          <span className="block text-cream-dim">
            <SplitText
              text="that compound their impact."
              delay={2.75}
              stagger={0.05}
            />
          </span>
        </h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-xl text-base leading-relaxed text-cream-dim md:text-lg"
        >
          The most consequential constraint facing high-growth organizations
          isn't capital. It's access to elite AI and technical talent
          {" "}— and the operational infrastructure to make them perform.
          <span className="text-cream"> Gigmote solves both.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href="/contact" size="lg" variant="primary">
            Book a Strategy Call
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Button>
          <Button href="/services" size="lg" variant="outline">
            Explore Services
          </Button>
        </motion.div>

        {/* Secondary CTA rail — surface the high-traffic flows that
            otherwise live deeper in the site */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.7 }}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
        >
          <Link
            href="/pricing#calculator"
            data-cursor="link"
            className="group inline-flex items-center gap-2 text-cream-dim transition-colors hover:text-gold"
          >
            <Calculator size={14} className="text-gold" />
            <span>Calculate your ROI</span>
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <span className="text-cream-line">·</span>
          <Link
            href="/jobs"
            data-cursor="link"
            className="group inline-flex items-center gap-2 text-cream-dim transition-colors hover:text-gold"
          >
            <span>See open roles</span>
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <span className="text-cream-line">·</span>
          <Link
            href="/join-gigmote"
            data-cursor="link"
            className="group inline-flex items-center gap-2 text-cream-dim transition-colors hover:text-gold"
          >
            <span>Apply to the bench</span>
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        {/* Scroll cue + metrics rail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 1 }}
          className="mt-auto flex flex-wrap items-end justify-between gap-8 pt-20"
        >
          <div className="flex flex-col items-start gap-3">
            <div className="relative h-10 w-px overflow-hidden bg-cream-line">
              <span className="absolute inset-x-0 top-0 h-3 w-px animate-[scroll-cue_2s_ease-in-out_infinite] bg-gold" />
            </div>
            <span className="label-eyebrow">Scroll</span>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="border-l border-cream-line pl-4">
                <div className="font-display text-2xl tracking-tight text-cream">
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scroll-cue {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(150%); }
          100% { transform: translateY(150%); }
        }
      `}</style>
    </section>
  );
}

const METRICS = [
  { value: "50%", label: "Avg cost reduction" },
  { value: "30d", label: "Time-to-productivity" },
  { value: "6", label: "Industries served" },
  { value: "24/7", label: "Global coverage" },
];
