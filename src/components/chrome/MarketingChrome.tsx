"use client";

import { usePathname } from "next/navigation";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { ScrollProgress } from "@/components/chrome/ScrollProgress";
import { IntroLoader } from "@/components/chrome/IntroLoader";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { PageTransition } from "@/components/chrome/PageTransition";
import { CursorHalo } from "@/components/chrome/CursorHalo";
import { ScrollToTopOnLoad } from "@/components/chrome/ScrollToTopOnLoad";
import { NavigationProvider, useNavigation } from "@/components/chrome/NavigationContext";

/**
 * Marketing chrome wrapper. Wraps everything in NavigationProvider so the
 * page-transition curtain can coordinate with route changes.
 *
 * The inner <Surface> reads the navigation state to fade the new page in
 * as the curtain reveals it.
 */
export function MarketingChrome({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <Surface>{children}</Surface>
    </NavigationProvider>
  );
}

function Surface({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const { state } = useNavigation();

  // While the curtain is over the page, hide the underlying content so
  // there's no flash of the previous or in-between layout.
  const contentOpacity =
    state === "covering" || state === "navigating" ? 0 : 1;

  if (isAdmin) {
    return (
      <>
        <ScrollToTopOnLoad />
        <ScrollProgress />
        <CustomCursor />
        <CursorHalo />
        <PageTransition />
        <div
          style={{
            opacity: contentOpacity,
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollToTopOnLoad />
      <IntroLoader />
      <ScrollProgress />
      <CustomCursor />
      <CursorHalo />
      <PageTransition />
      <Nav />
      <main
        id="main"
        className="relative"
        style={{
          opacity: contentOpacity,
          transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
