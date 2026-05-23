"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/components/chrome/NavigationContext";

/**
 * Page-transition curtain. Listens to NavigationContext state and animates
 * accordingly:
 *
 *   covering   → panels slide in from top/bottom
 *   navigating → panels held closed (router.push happens here)
 *   revealing  → panels slide back out
 *   idle       → no curtain
 *
 * The new page underneath gets a brief opacity fade-in handled by
 * MarketingChrome via the `data-page-fading` attribute it sets on <main>.
 */
export function PageTransition() {
  const { state } = useNavigation();
  const visible = state !== "idle";
  // covering / navigating → panels at 0%
  // revealing             → panels slide back to ±100%
  const panelsClosed = state === "covering" || state === "navigating";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="curtain"
          className="pointer-events-none fixed inset-0 z-[150]"
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* Top panel */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            initial={{ y: "-100%" }}
            animate={{ y: panelsClosed ? "0%" : "-100%" }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Bottom panel */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            initial={{ y: "100%" }}
            animate={{ y: panelsClosed ? "0%" : "100%" }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Center mark — visible while covered */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: panelsClosed ? 1 : 0 }}
            transition={{
              duration: panelsClosed ? 0.3 : 0.15,
              delay: panelsClosed ? 0.18 : 0,
            }}
          >
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-cream-mute">
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-gold">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/50" />
              </span>
              Gigmote
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
