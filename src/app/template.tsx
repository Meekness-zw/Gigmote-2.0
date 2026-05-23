"use client";

/**
 * Per-route template. Next.js mounts a fresh template on every navigation,
 * so this is where we'd add a crossfade — *if* we wanted one.
 *
 * We don't: the framer-motion-driven Y-translate version was forcing a
 * layout re-mount of every WebGL canvas on each navigation, which felt
 * like the whole page was dragging. Routing now reuses the same canvas
 * instance via the persistent layout chrome, and any per-section reveal
 * animation handles the "this page is new" feeling on its own.
 *
 * Kept as a passthrough so future per-route transitions can be re-introduced
 * here without touching the layout.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
