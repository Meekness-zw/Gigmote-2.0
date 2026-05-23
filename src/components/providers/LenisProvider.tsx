"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Smooth-scroll provider — Lenis was making the page feel slow on
 * mid-tier hardware (every wheel input was being interpolated on top of
 * an already-busy main thread with WebGL + scroll listeners).
 *
 * We've fallen back to native scroll. ScrollTrigger keeps working natively;
 * we just don't pre-process the input.
 *
 * To re-enable Lenis, set NEXT_PUBLIC_SMOOTH_SCROLL=1. Useful for testing
 * on faster machines or for client previews where smoothness matters more
 * than absolute responsiveness.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_SMOOTH_SCROLL === "1";
    if (!enabled) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const { default: Lenis } = await import("@studio-freight/lenis");
      if (cancelled) return;

      const lenis = new Lenis({
        lerp: 0.14,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      } as any);

      (window as any).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        delete (window as any).__lenis;
      };
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return <>{children}</>;
}
