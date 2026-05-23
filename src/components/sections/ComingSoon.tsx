"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SplitText } from "@/components/ui/SplitText";

interface Props {
  title: string;
  description: string;
  eyebrow?: string;
}

export function ComingSoon({ title, description, eyebrow = "Inner page" }: Props) {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-grain bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(246,206,72,0.10), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="label-eyebrow mb-6"
        >
          — {eyebrow}
        </motion.div>

        <h1 className="font-display text-5xl leading-[0.95] tracking-tighter md:text-7xl">
          <SplitText text={title} stagger={0.05} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-cream-dim md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            data-cursor="link"
            className="group inline-flex items-center gap-2 rounded-full border border-cream-faint px-5 py-2.5 text-sm text-cream-dim transition-colors hover:border-cream/40 hover:text-cream"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <Link
            href="/contact"
            data-cursor="magnet"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
          >
            Talk to us
          </Link>
        </motion.div>

        <div className="mt-16 font-mono text-[10px] uppercase tracking-[0.28em] text-cream-mute">
          Currently being rebuilt · Phase 3 of the redesign
        </div>
      </div>
    </section>
  );
}
