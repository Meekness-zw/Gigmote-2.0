import { renderOg } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Gigmote — About";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "About",
    title: "Built by operators, not recruiters.",
    accent: "gold",
  });
}
