"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";

const METRICS = [
  {
    label: "Cost reduction",
    target: 50,
    suffix: "%",
    body: "Average savings with global talent + AI workflows.",
  },
  {
    label: "Time-to-productivity",
    target: 30,
    suffix: " days",
    body: "Structured playbooks accelerate onboarding.",
  },
  {
    label: "Industries served",
    target: 6,
    suffix: "",
    body: "From healthcare to FinTech and Web3.",
  },
  {
    label: "Client CSAT",
    target: 94,
    suffix: "%",
    body: "Higher CSAT and retention with long-term teams.",
  },
];

export function ResultsBlock() {
  return (
    <section className="relative bg-cream py-24 text-ink md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-16 max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 mb-5">
            — Real business impact
          </div>
          <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
            <SplitText
              text="Operations that compound."
              stagger={0.05}
            />
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
            Scale customer support, RCM, sales development, and back-office ops
            globally — without sacrificing compliance or quality.
          </p>
        </FadeIn>

        <div className="grid gap-px overflow-hidden rounded-3xl bg-ink/10 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <Metric key={m.label} i={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({
  i,
  label,
  target,
  suffix,
  body,
}: {
  i: number;
  label: string;
  target: number;
  suffix: string;
  body: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1500 + i * 120;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      setVal(Math.round(target * ease(k)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, i]);

  return (
    <div ref={ref} className="relative flex flex-col gap-4 bg-cream p-8 md:p-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
        {label}
      </div>
      <div className="font-display text-5xl leading-none tracking-tightest tabular-nums md:text-6xl">
        {val}
        <span className="text-gold-deep">{suffix}</span>
      </div>
      <p className="text-sm leading-relaxed text-ink/70">{body}</p>
    </div>
  );
}
