import { renderOg } from "@/lib/og-template";
import { siteContent } from "@/data/content";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Gigmote case study";

const ACCENT_MAP: Record<string, "gold" | "teal" | "sage" | "orange"> = {
  "accounting-financial-operations-optimization": "gold",
  "b2b-sales-development-acceleration": "teal",
  "digital-marketing-performance-efficiency": "orange",
  "revenue-cycle-management-optimization": "sage",
  "integrated-back-office-sales-support-real-estate": "gold",
};

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = siteContent.caseStudies.find((x) => x.id === id);
  if (!c) {
    return renderOg({
      eyebrow: "Case study",
      title: "Engagement not found.",
      accent: "gold",
    });
  }
  return renderOg({
    eyebrow: c.industry,
    title: c.title,
    accent: ACCENT_MAP[c.id] ?? "gold",
  });
}
