"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-cream-line border-y border-cream-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              data-cursor="link"
              className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-gold md:py-8"
            >
              <span className="font-display text-lg leading-tight tracking-tight md:text-xl">
                {item.question}
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream-line transition-colors group-hover:border-gold group-hover:text-gold">
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-8 text-base leading-relaxed text-cream-dim md:text-lg">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
