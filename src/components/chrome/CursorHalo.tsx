"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor halo — a soft gold radial gradient that follows the pointer
 * across any element marked with [data-cursor-halo]. Sits in the same
 * element's overflow box; clips to it naturally.
 *
 * Pure CSS gradient driven by a CSS custom property. RAF-coalesced,
 * one paint per frame.
 */
export function CursorHalo() {
  const [enabled, setEnabled] = useState(false);
  const haloRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mq.matches || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let mx = 0;
    let my = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Find which halo-target the cursor is currently over.
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor-halo]"
      );

      if (target !== targetRef.current) {
        // Hide previous halo
        if (targetRef.current) targetRef.current.style.removeProperty("--halo-opacity");
        targetRef.current = target;
        if (target) target.style.setProperty("--halo-opacity", "1");
      }

      if (!target) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (targetRef.current) {
          const r = targetRef.current.getBoundingClientRect();
          targetRef.current.style.setProperty("--halo-x", `${mx - r.left}px`);
          targetRef.current.style.setProperty("--halo-y", `${my - r.top}px`);
        }
        raf = 0;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      if (targetRef.current) targetRef.current.style.removeProperty("--halo-opacity");
    };
  }, [enabled]);

  return null;
}
