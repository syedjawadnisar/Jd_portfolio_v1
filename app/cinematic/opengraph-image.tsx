import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogImage, ogPortrait } from "@/lib/og";

export const alt = "The 50-Second Cut — Jawad Nisar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// The static export prerenders every image route, so each must say so.
export const dynamic = "force-static";

/**
 * /cinematic needs its own card: a child segment that declares `openGraph`
 * replaces the parent's resolved object, image included, so the root card
 * never reaches this route. A file-convention image sits in the same segment
 * as the page and merges into that declaration.
 */
export default async function CinematicOpengraphImage() {
  const portrait = await ogPortrait();
  return ogImage(
    <OgCard
      headline="The 50-second cut."
      subline="Hands-free. Highlights only. The fastest path to a conversation."
      headlineSize={92}
      portrait={portrait}
    />,
  );
}
