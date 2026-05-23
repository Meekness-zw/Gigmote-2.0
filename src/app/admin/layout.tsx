import type { Metadata } from "next";

/**
 * Outer admin layout. Strips the marketing chrome (Nav / Footer) so the
 * admin gets its own dedicated surface, while still inheriting fonts,
 * tokens, and reduced-motion safety from the root layout.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Gigmote Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-ink text-cream">{children}</div>;
}
