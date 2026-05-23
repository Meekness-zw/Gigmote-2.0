import { renderOg } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Gigmote — Case studies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Case studies",
    title: "Five engagements. Five operating systems.",
    accent: "gold",
  });
}
