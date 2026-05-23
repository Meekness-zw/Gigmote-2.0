import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { MarketingChrome } from "@/components/chrome/MarketingChrome";

export const metadata: Metadata = {
  title: {
    default: "Gigmote — Build Global Teams. Automate Smarter. Scale Faster.",
    template: "%s — Gigmote",
  },
  description:
    "Gigmote sources elite AI and technical talent and deploys the operational systems that compound their impact. BPO advisory, global staffing, and AI business solutions.",
  metadataBase: new URL("https://gigmote.com"),
  openGraph: {
    title: "Gigmote — Build Global Teams. Automate Smarter. Scale Faster.",
    description:
      "Elite global talent + operational infrastructure. Built by operators, not recruiters.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Self-host-equivalent: Google Fonts CDN with preconnect.
            Used because next/font/google currently breaks under Turbopack
            in this Next 16.1 / R3F 9 stack. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="bg-ink text-cream antialiased">
        {/* Skip link for keyboard users — only visible on focus. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        <Providers>
          <MarketingChrome>{children}</MarketingChrome>
        </Providers>
      </body>
    </html>
  );
}
