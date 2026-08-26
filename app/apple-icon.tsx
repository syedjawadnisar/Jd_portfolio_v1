import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon for iOS, which applies its own mask — the monogram stays
 * well inside the safe area and the ground is painted edge to edge.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 100% at 30% 0%, #1b1c2e 0%, #0c0d18 62%)",
          color: "#e8b464",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        JN
      </div>
    ),
    size,
  );
}
