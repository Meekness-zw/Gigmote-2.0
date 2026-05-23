"use client";

import { motion } from "framer-motion";

const ROW = [
  "Healthcare",
  "SaaS",
  "FinTech",
  "Digital Marketing",
  "Sales Enablement",
  "IT · Web3",
];

export function LogoMarquee() {
  // Doubled for seamless loop
  const items = [...ROW, ...ROW];
  return (
    <section className="relative border-y border-cream-line bg-ink py-8">
      <div className="mx-auto mb-6 max-w-7xl px-6 flex items-center justify-between">
        <span className="label-eyebrow">Industries we operate in</span>
        <span className="label-eyebrow hidden sm:inline">UK · NA · Global delivery</span>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="flex w-max gap-12 px-6 will-change-transform"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 font-display text-2xl tracking-tight text-cream-dim md:text-3xl"
            >
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
