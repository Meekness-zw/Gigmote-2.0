import { renderOg } from "@/lib/og-template";
import { siteContent } from "@/data/content";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Gigmote industry";

const ACCENT_MAP: Record<string, "gold" | "teal" | "sage" | "orange"> = {
  healthcare: "sage",
  saas: "teal",
  "it-web3": "gold",
  "digital-marketing": "orange",
  "sales-enablement": "gold",
  fintech: "teal",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = siteContent.industries.find((x) => x.slug === slug);
  if (!ind) {
    return renderOg({
      eyebrow: "Industry",
      title: "Vertical not found.",
      accent: "gold",
    });
  }
  return renderOg({
    eyebrow: `Industry · ${ind.title}`,
    title: ind.heroTitle,
    accent: ACCENT_MAP[ind.slug] ?? "gold",
  });
}
