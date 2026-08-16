import { ImageResponse } from "next/og";
import { bio } from "@/data/bio";

export const alt = "Jawad Nisar — Senior Full-Stack & AI Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The shared-link card. Generated at build time so there is no binary asset
 * to keep in sync with the copy — it reads from data/bio.ts like the site.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 100% at 20% 0%, #1b1c2e 0%, #0c0d18 62%)",
          color: "#f4f4f8",
          fontSize: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9a9ab0",
          }}
        >
          {bio.name} — {bio.location}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1.06,
            fontWeight: 600,
            letterSpacing: -2,
            maxWidth: 960,
          }}
        >
          {bio.motto}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", width: 64, height: 4, background: "#e8b464" }} />
          <div style={{ display: "flex", fontSize: 26, color: "#e8b464" }}>
            {bio.title}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
