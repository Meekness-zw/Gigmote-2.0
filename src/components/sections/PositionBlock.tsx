"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/FadeIn";
import { SplitText } from "@/components/ui/SplitText";

const STANDARDS = [
  {
    label: "Talent standard",
    body:
      "Rigorous vetting across technical depth, communication, and long-term retention — not résumé matching.",
  },
  {
    label: "AI integration",
    body:
      "Automation embedded into every engagement — not offered as a bolt-on after placement.",
  },
  {
    label: "Operating model",
    body:
      "SLAs, QA frameworks, and performance dashboards are standard — not optional.",
  },
  {
    label: "Engagement design",
    body:
      "Pilot → scale → optimise. We start focused and expand with evidence, not promises.",
  },
];

export function PositionBlock() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36 border-b border-cream-line">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:items-start">
          {/* Sticky text */}
          <div className="md:col-span-7">
            <FadeIn>
              <div className="label-eyebrow mb-5">— Our position</div>
              <h2 className="font-display text-4xl leading-[1.04] tracking-tighter md:text-5xl lg:text-6xl">
                <SplitText
                  text="Built by operators who have built BPOs and shipped AI systems"
                  stagger={0.04}
                />
                <span className="block text-cream-dim mt-3">
                  <SplitText
                    text="— not recruiters who have read about them."
                    stagger={0.04}
                    delay={0.2}
                  />
                </span>
              </h2>
            </FadeIn>

            <div className="mt-12 divide-y divide-cream-line border-y border-cream-line">
              {STANDARDS.map((row, i) => (
                <FadeIn key={row.label} delay={i * 0.06}>
                  <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-[200px_1fr] md:gap-12 md:py-8">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-mute">
                      {row.label}
                    </div>
                    <p className="text-base leading-relaxed text-cream-dim md:text-lg">
                      {row.body}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Sticky image with parallax */}
          <div className="md:col-span-5">
            <div className="sticky top-24">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-cream-line">
                <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]">
                  <Image
                    src="/images/AI Curiosity lab in the rainforset jungle of africa in a call centre setting- bright setting, icons flying , glass office setting add people (1) (1).jpg"
                    alt="Gigmote operations team"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>

                {/* Gradient anchor */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30"
                />

                {/* Editorial caption */}
                <div className="pointer-events-none absolute bottom-6 left-6 right-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                    — Field operations
                  </div>
                  <div className="mt-2 font-display text-xl leading-tight tracking-tight text-cream md:text-2xl">
                    Where the talent lives.
                  </div>
                </div>
              </div>

              {/* Stat strip below image */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-cream-line bg-ink-2 p-5">
                  <div className="font-display text-3xl tracking-tight text-gold">
                    24/7
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                    Global delivery
                  </div>
                </div>
                <div className="rounded-2xl border border-cream-line bg-ink-2 p-5">
                  <div className="font-display text-3xl tracking-tight text-gold">
                    100%
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-cream-mute">
                    Long-term placement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
