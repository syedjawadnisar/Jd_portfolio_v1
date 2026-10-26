import { bio } from "@/data/bio";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogImage, ogPortrait } from "@/lib/og";

export const alt = "Jawad Nisar — Senior Full-Stack & AI Architect";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
// The static export prerenders every image route, so each must say so.
export const dynamic = "force-static";

/**
 * The shared-link card. Generated at build time so there is no binary asset
 * to keep in sync with the copy — it reads from data/bio.ts like the site.
 */
export default async function OpengraphImage() {
  const portrait = await ogPortrait();
  return ogImage(<OgCard headline={bio.motto} portrait={portrait} />);
}
