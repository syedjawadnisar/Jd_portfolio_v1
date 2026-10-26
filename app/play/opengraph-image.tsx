import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogImage, ogPortrait } from "@/lib/og";

export const alt = "The Interactive Journey — Jawad Nisar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// The static export prerenders every image route, so each must say so.
export const dynamic = "force-static";

/**
 * /play needs its own card for the same reason /cinematic does: the page
 * declares `openGraph`, which replaces the parent's images.
 */
export default async function PlayOpengraphImage() {
  const portrait = await ogPortrait();
  return ogImage(
    <OgCard
      headline="The interactive journey."
      subline="Three questions, three worlds, one mystery box. A mini platformer, not a form."
      headlineSize={92}
      portrait={portrait}
    />,
  );
}
