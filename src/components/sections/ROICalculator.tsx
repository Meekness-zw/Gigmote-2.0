"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * ROI calculator — three inputs, animated outputs.
 *
 * Inputs
 *   teamSize: number of roles being replaced or added
 *   avgUsSalary: average loaded US salary per role ($/yr)
 *   gigmoteRate: blended Gigmote $/hr × 2080 hr ≈ annual cost per role
 *
 * Outputs
 *   USD annual saved   = teamSize × (avgUsSalary − gigmoteRate × 2080)
 *   Cost reduction %   = saved / (teamSize × avgUsSalary)
 *   Productivity boost = teamSize × 250 hours/yr saved with AI automation
 */
export function ROICalculator() {
  const [teamSize, setTeamSize] = useState(4);
  const [salary, setSalary] = useState(85000);
  const [rate, setRate] = useState(12);

  const { savings, savingsPct, hoursSaved, gigmoteAnnual } = useMemo(() => {
    const gigmoteAnnual = rate * 2080;
    const localTotal = teamSize * salary;
    const gigmoteTotal = teamSize * gigmoteAnnual;
    const savings = Math.max(0, localTotal - gigmoteTotal);
    const savingsPct = localTotal > 0 ? (savings / localTotal) * 100 : 0;
    const hoursSaved = teamSize * 250;
    return { savings, savingsPct, hoursSaved, gigmoteAnnual };
  }, [teamSize, salary, rate]);

  return (
    <section
      id="calculator"
      className="relative bg-ink-1 py-24 md:py-36 border-b border-cream-line scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mb-16 max-w-3xl">
          <div className="label-eyebrow mb-5">— See the impact</div>
          <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-6xl">
            <SplitText text="Run the math on your operation." stagger={0.05} />
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg">
            Adjust the team profile and watch the numbers land. These figures
            mirror the actual cost-to-savings ratio we deliver across CX, Ops,
            Finance, and SDR engagements.
          </p>
        </FadeIn>

        <div className="overflow-hidden rounded-3xl border border-cream-line bg-ink-2">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr]">
            {/* Inputs */}
            <div className="border-b border-cream-line p-8 md:border-b-0 md:border-r md:p-10">
              <div className="label-eyebrow mb-8">Your operation</div>

              <Slider
                label="Team size"
                value={teamSize}
                onChange={setTeamSize}
                min={1}
                max={50}
                step={1}
                format={(v) => `${v} ${v === 1 ? "role" : "roles"}`}
              />

              <Slider
                label="Avg loaded US salary (per role)"
                value={salary}
                onChange={setSalary}
                min={45000}
                max={180000}
                step={1000}
                format={(v) => `$${(v / 1000).toFixed(0)}k`}
              />

              <Slider
                label="Gigmote blended rate"
                value={rate}
                onChange={setRate}
                min={9}
                max={45}
                step={1}
                format={(v) => `$${v}/hr`}
              />

              <div className="mt-8 rounded-2xl bg-ink-3 p-5">
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                  Annual cost per role
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl tracking-tight text-cream">
                    ${gigmoteAnnual.toLocaleString()}
                  </span>
                  <span className="text-sm text-cream-mute">/ yr</span>
                </div>
              </div>
            </div>

            {/* Outputs */}
            <div className="relative bg-gradient-to-br from-gold/[0.04] to-transparent p-8 md:p-10">
              {/* Animated halo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 80% 0%, rgba(246,206,72,0.08), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="label-eyebrow mb-8">
                  Your annual outcome
                </div>

                <AnimatedDollar value={savings} />

                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                  ≈ {Math.round(savingsPct)}% cost reduction
                </div>

                <div className="hairline my-8" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                      Engineering hours unlocked
                    </div>
                    <div className="mt-2 font-display text-3xl tracking-tight text-cream tabular-nums">
                      {hoursSaved.toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs text-cream-mute">
                      with AI workflow layer
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                      Time-to-productivity
                    </div>
                    <div className="mt-2 font-display text-3xl tracking-tight text-cream">
                      30 d
                    </div>
                    <div className="mt-1 text-xs text-cream-mute">
                      avg first delivery
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Button href="/contact" size="lg" variant="primary" className="w-full sm:w-auto">
                    Model your specific use case
                    <ArrowRight size={16} />
                  </Button>
                  <p className="mt-3 text-xs text-cream-mute">
                    No commitment. 30-minute call with the operations team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedDollar({ value }: { value: number }) {
  // Smooth the number with framer-motion's spring via interpolation
  return (
    <motion.div
      key={Math.floor(value / 1000)}
      initial={{ opacity: 0.4, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="font-display text-5xl leading-none tracking-tightest tabular-nums md:text-6xl lg:text-7xl"
    >
      <span className="text-cream-mute">$</span>
      <span className="text-cream">{Math.round(value).toLocaleString()}</span>
    </motion.div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

function Slider({ label, value, onChange, min, max, step, format }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm text-cream-dim">{label}</label>
        <span className="font-mono text-sm text-gold tabular-nums">
          {format(value)}
        </span>
      </div>
      <div className="relative">
        <div className="h-1 rounded-full bg-cream-faint" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gold"
          style={{ width: `${pct}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-gold shadow-[0_0_16px_2px_rgba(246,206,72,0.5)]"
          style={{ left: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-grab opacity-0"
          data-cursor="link"
        />
      </div>
    </div>
  );
}
