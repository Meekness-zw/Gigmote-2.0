import { renderOg } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Gigmote — Careers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Careers",
    title: "Join the future of work.",
    accent: "gold",
  });
}
