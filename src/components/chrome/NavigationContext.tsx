"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type NavState = "idle" | "covering" | "navigating" | "revealing";

interface NavCtx {
  state: NavState;
  navigate: (href: string) => void;
}

const NavigationContext = createContext<NavCtx | null>(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    // Fall back to a passthrough when used outside the provider (e.g. on
    // /admin where the marketing chrome isn't mounted).
    const router = useRouter();
    return {
      state: "idle" as const,
      navigate: (href: string) => router.push(href),
    };
  }
  return ctx;
}

const COVER_MS = 400;     // curtain slide-in time
const HOLD_MS = 80;       // small pause so the new page can mount under cover

interface Props {
  children: ReactNode;
}

/**
 * Coordinates the page-transition curtain with navigation.
 *
 * Flow:
 *   1. Caller invokes `navigate(href)`
 *   2. We flip state → "covering" → CSS curtains slide in (~400ms)
 *   3. After COVER_MS, we router.push(href)
 *   4. Brief HOLD_MS so the new page can mount behind the curtain
 *   5. State → "revealing" → curtains slide out (handled by the curtain
 *      component itself, which watches `state`)
 *   6. Back to "idle"
 *
 * The component reading this context (PageTransition.tsx) renders the
 * curtains and the content-fade overlay based on `state`.
 */
export function NavigationProvider({ children }: Props) {
  const [state, setState] = useState<NavState>("idle");
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      if (state !== "idle") return;
      setState("covering");

      window.setTimeout(() => {
        setState("navigating");
        router.push(href);
        window.setTimeout(() => {
          setState("revealing");
          window.setTimeout(() => setState("idle"), 500);
        }, HOLD_MS);
      }, COVER_MS);
    },
    [state, router]
  );

  return (
    <NavigationContext.Provider value={{ state, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}
