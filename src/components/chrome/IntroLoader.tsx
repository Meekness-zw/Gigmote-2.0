"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Lusion-style intro: 0 → 100 counter, mono-spaced numerals,
 * dual-pane reveal panels lift to expose the page.
 * Skip on repeat visits via sessionStorage.
 */
export function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem("gm-intro");
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setVisible(false);
      return;
    }

    // Lock body scroll during intro
    document.body.style.overflow = "hidden";

    let p = 0;
    // Variable pace — slow start, mid-burst, easeout. Total ~1.8s
    const tick = () => {
      const step = p < 30 ? 0.6 : p < 60 ? 1.4 : p < 92 ? 1.0 : 0.4;
      p = Math.min(100, p + step);
      setProgress(Math.floor(p));
      if (p < 100) {
        requestAnimationFrame(tick);
      } else {
        // Hold the 100 a beat, then exit
        setTimeout(() => {
          sessionStorage.setItem("gm-intro", "1");
          setVisible(false);
        }, 360);
      }
    };
    requestAnimationFrame(tick);

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
      // Inform Lenis it can resume if it's paused
      const lenis = (window as any).__lenis;
      if (lenis?.start) lenis.start();
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] pointer-events-none"
          aria-hidden
        >
          {/* Top panel */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          />
          {/* Bottom panel */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Center content */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-8">
              {/* Logo mark */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-cream-mute"
              >
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-gold">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
                </span>
                Gigmote
              </motion.div>

              {/* Counter */}
              <div className="relative font-display text-[18vw] leading-none tracking-tight md:text-[10vw]">
                <span className="tabular-nums text-cream">
                  {progress.toString().padStart(3, "0")}
                </span>
                <span className="absolute left-full top-2 ml-2 font-mono text-xs tracking-[0.2em] text-cream-mute">
                  %
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-px w-[min(60vw,420px)] overflow-hidden bg-cream-line">
                <motion.div
                  className="absolute inset-y-0 left-0 origin-left bg-gold"
                  style={{ width: "100%", transform: `scaleX(${progress / 100})` }}
                />
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream-mute"
              >
                Sourcing the minds · Deploying the systems
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
