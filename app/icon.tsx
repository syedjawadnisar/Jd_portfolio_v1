import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The tab-strip monogram. Authored in code so there is no binary asset in the
 * repo, and flat at this size — a gradient reads as noise at 32px. Next wires
 * this in as <link rel="icon"> for every route from the root segment, which is
 * why an icon does not need the per-route treatment OG images do.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0d18",
          color: "#e8b464",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        JN
      </div>
    ),
    size,
  );
}
