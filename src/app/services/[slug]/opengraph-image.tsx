import { renderOg } from "@/lib/og-template";
import { siteContent } from "@/data/content";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Gigmote service";

const ACCENT_MAP: Record<string, "gold" | "teal" | "sage" | "orange"> = {
  "bpo-matchmaking-advisory": "gold",
  "global-staffing": "teal",
  "ai-business-solutions": "orange",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = siteContent.services.find((x) => x.slug === slug);
  if (!s) {
    return renderOg({
      eyebrow: "Service",
      title: "Capability not found.",
      accent: "gold",
    });
  }
  return renderOg({
    eyebrow: s.slogan,
    title: s.title,
    accent: ACCENT_MAP[s.slug] ?? "gold",
  });
}
