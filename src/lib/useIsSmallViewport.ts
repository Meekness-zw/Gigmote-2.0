"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is below `breakpoint` (default 640 — Tailwind's `sm`).
 * Used to skip heavier WebGL scenes on phones where they cost battery and
 * deliver less visual punch on the smaller canvas.
 */
export function useIsSmallViewport(breakpoint = 640): boolean {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setSmall(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSmall(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return small;
}
