"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight cursor: dot + ring with snappy follow.
 *
 * Perf notes:
 *  - No mix-blend-mode (it forces full-page repaints on every move).
 *  - One RAF loop, two transforms per frame, no React state in the loop.
 *  - Hover styles applied via class toggles on the ring rather than React
 *    re-renders, so each pointerover doesn't trigger a render.
 *
 * Mount order matters: the device-support detection runs first and flips
 * `enabled`, which causes the cursor elements to render. Only *then*
 * does the second effect run — once refs are guaranteed attached.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  // First pass: decide whether to enable the cursor at all.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!mq.matches || reduced) return;
    setEnabled(true);
  }, []);

  // Second pass — runs only after the cursor elements are in the DOM.
  // This is where the RAF loop + event listeners attach.
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let mode: "none" | "link" | "magnet" = "none";

    const setMode = (next: "none" | "link" | "magnet", labelText: string | null) => {
      if (next === mode) {
        if (label) label.textContent = labelText ?? "";
        return;
      }
      mode = next;
      ring.classList.remove("c-none", "c-link", "c-magnet");
      ring.classList.add(`c-${next}`);
      if (label) label.textContent = labelText ?? "";
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]"
      );
      if (!target) return setMode("none", null);
      const kind = target.dataset.cursor;
      setMode(
        kind === "magnet" ? "magnet" : "link",
        target.dataset.cursorLabel ?? null
      );
    };

    const tick = () => {
      // Snappier follow than before. 0.42 ring is still soft but no longer feels
      // like it's "dragging." Dot effectively pins to the pointer.
      rx += (mx - rx) * 0.42;
      ry += (my - ry) * 0.42;
      // Round to whole pixels — avoids subpixel compositing jitter.
      const rxR = Math.round(rx);
      const ryR = Math.round(ry);
      ring.style.transform = `translate3d(${rxR}px, ${ryR}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${Math.round(mx)}px, ${Math.round(my)}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        .c-cursor-ring {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          border: 1px solid rgba(249,249,245,0.42);
          pointer-events: none;
          will-change: transform, width, height, border-color, background-color;
          transition: width 0.18s ease-out, height 0.18s ease-out,
                      border-color 0.18s ease-out, background-color 0.18s ease-out;
        }
        .c-cursor-ring.c-link {
          width: 52px;
          height: 52px;
          border-color: rgba(246,206,72,0.85);
        }
        .c-cursor-ring.c-magnet {
          width: 70px;
          height: 70px;
          border-color: rgba(246,206,72,0.9);
          background-color: rgba(246,206,72,0.12);
        }
        .c-cursor-dot {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #F6CE48;
          pointer-events: none;
          will-change: transform;
        }
        .c-cursor-label {
          position: absolute;
          left: 50%;
          top: 100%;
          margin-top: 10px;
          transform: translateX(-50%);
          white-space: nowrap;
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #F9F9F5;
        }
      `}</style>
      <div ref={ringRef} aria-hidden className="c-cursor-ring c-none">
        <span ref={labelRef} className="c-cursor-label" />
      </div>
      <div ref={dotRef} aria-hidden className="c-cursor-dot" />
    </>
  );
}
