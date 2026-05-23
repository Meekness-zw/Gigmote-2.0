import { renderOg } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Gigmote — Contact";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Let's talk operations.",
    accent: "gold",
  });
}
