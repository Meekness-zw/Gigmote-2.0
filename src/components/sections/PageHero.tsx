"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SplitText } from "@/components/ui/SplitText";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsSmallViewport } from "@/lib/useIsSmallViewport";

// Small ambient WebGL accent so every inner page still feels alive.
// Loads lazily — never blocks the page on the canvas.
const AmbientCanvas = dynamic(
  () => import("@/components/three/AmbientCanvas").then((m) => m.AmbientCanvas),
  { ssr: false, loading: () => null }
);
const LatticeScene = dynamic(
  () => import("@/components/three/scenes/LatticeScene").then((m) => m.LatticeScene),
  { ssr: false, loading: () => null }
);
const NetworkScene = dynamic(
  () => import("@/components/three/scenes/NetworkScene").then((m) => m.NetworkScene),
  { ssr: false, loading: () => null }
);
const FlowScene = dynamic(
  () => import("@/components/three/scenes/FlowScene").then((m) => m.FlowScene),
  { ssr: false, loading: () => null }
);
const RingsScene = dynamic(
  () => import("@/components/three/scenes/RingsScene").then((m) => m.RingsScene),
  { ssr: false, loading: () => null }
);
const PulseScene = dynamic(
  () => import("@/components/three/scenes/PulseScene").then((m) => m.PulseScene),
  { ssr: false, loading: () => null }
);
const GridScene = dynamic(
  () => import("@/components/three/scenes/GridScene").then((m) => m.GridScene),
  { ssr: false, loading: () => null }
);
const ConstellationScene = dynamic(
  () =>
    import("@/components/three/scenes/ConstellationScene").then(
      (m) => m.ConstellationScene
    ),
  { ssr: false, loading: () => null }
);

type SceneKind =
  | "ambient"
  | "lattice"
  | "network"
  | "flow"
  | "rings"
  | "pulse"
  | "grid"
  | "constellation";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: "gold" | "teal" | "sage" | "orange";
  scene?: SceneKind;
}

const ACCENT_MAP: Record<NonNullable<Props["accent"]>, string> = {
  gold: "rgba(246,206,72,0.15)",
  teal: "rgba(154,210,210,0.13)",
  sage: "rgba(199,214,195,0.13)",
  orange: "rgba(232,166,126,0.13)",
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  accent = "gold",
  scene = "ambient",
}: Props) {
  const reduced = useReducedMotion();
  const isSmall = useIsSmallViewport();

  const SceneComponent =
    scene === "lattice"
      ? LatticeScene
      : scene === "network"
      ? NetworkScene
      : scene === "flow"
      ? FlowScene
      : scene === "rings"
      ? RingsScene
      : scene === "pulse"
      ? PulseScene
      : scene === "grid"
      ? GridScene
      : scene === "constellation"
      ? ConstellationScene
      : AmbientCanvas;

  return (
    <section
      className="relative isolate overflow-hidden bg-grain bg-ink pt-32 pb-24 md:pt-44 md:pb-32"
      data-cursor-halo
    >
      {/* WebGL accent — replaced with a static gradient when reduced motion
          *or* on small viewports (battery + perf). */}
      <div className="absolute inset-0 z-0 opacity-90">
        {reduced || isSmall ? (
          <div
            aria-hidden
            className="h-full w-full"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${ACCENT_MAP[accent]}, transparent 60%)`,
            }}
          />
        ) : scene === "ambient" ? (
          <AmbientCanvas accent={accent} />
        ) : (
          <SceneComponent />
        )}
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% 50%, transparent 0%, rgba(10,10,11,0.4) 70%, rgba(10,10,11,0.92) 100%), radial-gradient(ellipse 50% 40% at 50% 100%, ${ACCENT_MAP[accent]}, transparent 70%)`,
        }}
      />

      <div className="relative z-20 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="relative grid h-1.5 w-1.5 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <span className="label-eyebrow">{eyebrow}</span>
        </motion.div>

        <h1 className="max-w-[18ch] font-display text-4xl leading-[0.98] tracking-tighter md:text-6xl lg:text-7xl">
          <SplitText text={title} stagger={0.05} />
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
