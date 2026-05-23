"use client";

import { useEffect } from "react";

/**
 * Disable the browser's auto-scroll-restoration and force every page load
 * (including hard refresh) to land at the top of the document.
 *
 * Without this, browsers preserve scrollY across reloads — useful for some
 * apps, but it makes the intro loader / hero animations look wrong because
 * the user lands mid-page with the curtain animating over content they
 * can't see.
 */
export function ScrollToTopOnLoad() {
  useEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      /* some browsers (or sandboxed iframes) disallow this — fine to ignore */
    }
    window.scrollTo(0, 0);
  }, []);
  return null;
}
