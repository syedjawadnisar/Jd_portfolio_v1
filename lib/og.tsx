import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import sharp from "sharp";
import { bio } from "@/data/bio";

/**
 * The shared layout behind every generated share card.
 *
 * Four routes emit one — the root, /cinematic, /play and /projects — and a card that
 * drifts from its siblings looks like a different person's site in a Slack
 * unfurl. One layout, per-route copy.
 *
 * Everything here is authored in code: satori (behind next/og) supports a
 * narrow CSS subset, so every element that holds children declares
 * `display: flex` explicitly.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/jpeg";

const BG = "#0c0d18";
const BG_LIFT = "#1b1c2e";
const FG = "#f4f4f8";
const FG_MUTED = "#9a9ab0";
const ACCENT = "#e8b464";

/** The portrait cut-out, faded at its edges in the file itself: satori has no CSS masks. */
const PORTRAIT = { width: 470, height: 630 };

let portraitData: Promise<string> | undefined;

/** The portrait as a data URL, read once per build. Cards render at build time only. */
export function ogPortrait(): Promise<string> {
  portraitData ??= readFile(join(process.cwd(), "assets/og-portrait.png")).then(
    (png) => `data:image/png;base64,${png.toString("base64")}`,
  );
  return portraitData;
}

/**
 * Renders a card as JPEG. ImageResponse only emits PNG, and with the photo in
 * it the PNG weighs about 486 KB, past the size where WhatsApp previews start
 * to fail. Quality 90 with full colour resolution keeps the gold type free of
 * fringing at about 82 KB.
 */
export async function ogImage(card: ReactElement): Promise<Response> {
  const png = Buffer.from(await new ImageResponse(card, OG_SIZE).arrayBuffer());
  const jpeg = await sharp(png)
    .flatten({ background: BG })
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": OG_CONTENT_TYPE } });
}

export function OgCard({
  headline,
  subline,
  headlineSize = 78,
  portrait,
}: {
  headline: string;
  subline?: string;
  headlineSize?: number;
  /** Data URL from ogPortrait(). The copy narrows to leave it the right side. */
  portrait?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
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
      {portrait ? (
        // eslint-disable-next-line @next/next/no-img-element -- satori renders this, not a browser
        <img
          src={portrait}
          alt=""
          width={PORTRAIT.width}
          height={PORTRAIT.height}
          style={{ position: "absolute", right: 0, bottom: 0 }}
        />
      ) : null}
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

      <div style={{ display: "flex", flexDirection: "column", maxWidth: portrait ? 640 : 960 }}>
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
