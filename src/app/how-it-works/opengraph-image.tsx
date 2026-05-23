import { renderOg } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Gigmote — How it works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "How it works",
    title: "Four phases. One operating system.",
    accent: "gold",
  });
}
