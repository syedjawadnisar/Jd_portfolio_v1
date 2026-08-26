import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "The Interactive Journey — Jawad Nisar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * /play needs its own card for the same reason /cinematic does: the page
 * declares `openGraph`, which replaces the parent's images.
 */
export default function PlayOpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        headline="The interactive journey."
        subline="Three questions, three worlds, one mystery box. A mini platformer, not a form."
        headlineSize={92}
      />
    ),
    size,
  );
}
