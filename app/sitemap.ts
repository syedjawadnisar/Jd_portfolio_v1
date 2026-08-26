import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Frozen into sitemap.xml at build time — a per-request timestamp would tell
// crawlers the content changed on every fetch and get lastmod ignored.
export const dynamic = "force-static";

const lastModified = new Date();

const absolute = (path: string) => new URL(path, siteUrl).toString();

/**
 * The three real content routes only.
 *
 * Deliberately absent: /explore (a 308 to "/" — a redirect is not a
 * destination) and the generated image routes (/icon, /apple-icon, every
 * opengraph-image), which are assets referenced from the pages, not pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // The bare origin — the exact string the root canonical emits.
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absolute("/cinematic"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: absolute("/play"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
