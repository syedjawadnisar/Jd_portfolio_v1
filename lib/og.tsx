import { bio } from "@/data/bio";

/**
 * The shared layout behind every generated share card.
 *
 * Three routes emit one — the root, /cinematic and /play — and a card that
 * drifts from its siblings looks like a different person's site in a Slack
 * unfurl. One layout, per-route copy.
 *
 * Everything here is authored in code: satori (behind next/og) supports a
 * narrow CSS subset, so every element that holds children declares
 * `display: flex` explicitly.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0c0d18";
const BG_LIFT = "#1b1c2e";
const FG = "#f4f4f8";
const FG_MUTED = "#9a9ab0";
const ACCENT = "#e8b464";

export function OgCard({
  headline,
  subline,
  headlineSize = 78,
}: {
  headline: string;
  subline?: string;
  headlineSize?: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: `radial-gradient(120% 100% at 20% 0%, ${BG_LIFT} 0%, ${BG} 62%)`,
        color: FG,
        fontSize: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: FG_MUTED,
        }}
      >
        {bio.name} — {bio.location}
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
        <div
          style={{
            display: "flex",
            fontSize: headlineSize,
            lineHeight: 1.06,
            fontWeight: 600,
            letterSpacing: -2,
          }}
        >
          {headline}
        </div>
        {subline ? (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.35,
              color: FG_MUTED,
            }}
          >
            {subline}
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", width: 64, height: 4, background: ACCENT }} />
        <div style={{ display: "flex", fontSize: 26, color: ACCENT }}>
          {bio.title}
        </div>
      </div>
    </div>
  );
}
