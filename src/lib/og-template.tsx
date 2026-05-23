import { ImageResponse } from "next/og";

interface OgArgs {
  eyebrow: string;
  title: string;
  accent?: "gold" | "teal" | "sage" | "orange";
}

const ACCENT_HEX: Record<NonNullable<OgArgs["accent"]>, string> = {
  gold: "rgba(246,206,72,0.18)",
  teal: "rgba(154,210,210,0.18)",
  sage: "rgba(199,214,195,0.18)",
  orange: "rgba(232,166,126,0.18)",
};

const ACCENT_BAR: Record<NonNullable<OgArgs["accent"]>, string> = {
  gold: "#F6CE48",
  teal: "#9AD2D2",
  sage: "#C7D6C3",
  orange: "#E8A67E",
};

export function renderOg({ eyebrow, title, accent = "gold" }: OgArgs) {
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
          background: `radial-gradient(ellipse 90% 70% at 50% 50%, ${ACCENT_HEX[accent]}, transparent 60%), linear-gradient(#0A0A0B, #0A0A0B)`,
          color: "#F9F9F5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              border: `1.5px solid ${ACCENT_BAR[accent]}`,
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
                background: ACCENT_BAR[accent],
              }}
            />
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(249,249,245,0.5)",
              display: "flex",
            }}
          >
            GIGMOTE
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: ACCENT_BAR[accent],
              marginBottom: 24,
              display: "flex",
            }}
          >
            {`— ${eyebrow}`}
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "#F9F9F5",
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

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
          <span>Built by operators · Not recruiters</span>
          <span>gigmote.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
