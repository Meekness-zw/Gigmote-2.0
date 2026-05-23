"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SplitText } from "@/components/ui/SplitText";

export function CTABlock() {
  return (
    <section className="relative overflow-hidden bg-ink py-32 md:py-44">
      {/* Aurora gold gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(246,206,72,0.18), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 bg-grain"
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <div className="label-eyebrow mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-cream-line" />
          <span>Ready when you are</span>
          <span className="h-px w-8 bg-cream-line" />
        </div>

        <h2 className="font-display text-5xl leading-[0.9] tracking-tightest md:text-8xl lg:text-[120px]">
          <span className="block">
            <SplitText text="Build global teams." stagger={0.06} />
          </span>
          <span className="block text-cream-dim">
            <SplitText text="Automate smarter." stagger={0.06} delay={0.05} />
          </span>
          <span className="block text-gold">
            <SplitText text="Scale faster." stagger={0.06} delay={0.1} />
          </span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/contact" size="lg" variant="primary">
            Book a Strategy Call
            <ArrowUpRight size={16} />
          </Button>
          <Button href="/case-studies" size="lg" variant="outline">
            Read case studies
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
