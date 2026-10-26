import { projects } from "@/data/projects";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogImage, ogPortrait } from "@/lib/og";

export const alt = "All Projects — Jawad Nisar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * /projects declares its own `openGraph`, which replaces the parent's images,
 * so it needs its own card, like /play and /cinematic.
 */
export default async function ProjectsOpengraphImage() {
  const portrait = await ogPortrait();
  return ogImage(
    <OgCard
      headline="Every system, in one place."
      subline={`${projects.length} projects: what was built, where, and on what stack.`}
      headlineSize={88}
      portrait={portrait}
    />,
  );
}
