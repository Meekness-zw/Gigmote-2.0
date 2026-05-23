import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gigmote — Build Global Teams. Automate Smarter. Scale Faster.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(246,206,72,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(154,210,210,0.12), transparent 60%), linear-gradient(#0A0A0B, #0A0A0B)",
          color: "#F9F9F5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top row — logo mark + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              border: "1.5px solid rgba(246,206,72,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: "#F6CE48",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(249,249,245,0.5)",
            }}
          >
            GIGMOTE
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "#F9F9F5",
            }}
          >
            Build global teams.
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "rgba(249,249,245,0.55)",
              marginTop: 6,
            }}
          >
            Automate smarter.
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "#F6CE48",
              marginTop: 6,
            }}
          >
            Scale faster.
          </div>
        </div>

        {/* Bottom row — micro labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(249,249,245,0.5)",
          }}
        >
          <span>BPO advisory · global staffing · AI solutions</span>
          <span>gigmote.com</span>
        </div>
      </div>
    ),
    size
  );
}
