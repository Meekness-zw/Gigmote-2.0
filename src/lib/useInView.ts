"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * SSR-safe IntersectionObserver hook. Returns a ref + an `inView` flag
 * that flips true when the element crosses the configured threshold.
 *
 * Used to pause off-screen WebGL canvases — every frame we skip when
 * out of view is GPU time we give back to the visible scene.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { rootMargin: "200px" }
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return [ref, inView];
}
