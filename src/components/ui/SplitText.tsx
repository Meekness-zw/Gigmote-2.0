"use client";

import { motion, type Variants } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  by?: "word" | "char";
  /** Applies a single span with overflow: hidden per word so masking looks tighter. */
  mask?: boolean;
  once?: boolean;
}

const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const child: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  by = "word",
  mask = true,
  once = true,
}: Props) {
  const parts = by === "word" ? text.split(" ") : Array.from(text);
  return (
    <motion.span
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.4 }}
      aria-label={text}
    >
      {parts.map((p, i) => (
        <span
          key={i}
          className={`inline-block ${mask ? "overflow-hidden align-baseline" : ""}`}
          aria-hidden
        >
          <motion.span variants={child} className="inline-block">
            {p}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
