import { renderOg } from "@/lib/og-template";

export const runtime = "edge";
export const alt = "Gigmote — Industries";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOg({
    eyebrow: "Industries",
    title: "Six verticals. One operating playbook.",
    accent: "gold",
  });
}
