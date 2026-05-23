"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const variants: Variants = {
  hidden: (custom: { y: number }) => ({ opacity: 0, y: custom.y }),
  visible: { opacity: 1, y: 0 },
};

export function FadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  className,
  once = true,
  amount = 0.2,
}: Props) {
  return (
    <motion.div
      className={className}
      custom={{ y }}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
