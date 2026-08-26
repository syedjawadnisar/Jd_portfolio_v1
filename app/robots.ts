import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Crawl rules, decided from the origin the build actually resolved.
 *
 * lib/site.ts falls back through the platform preview domains to localhost
 * when NEXT_PUBLIC_SITE_URL is absent, so the resolved origin is the only
 * honest signal available at build time about *which* deployment this is.
 * Anything that is not the real production host emits a disallow-all: a
 * duplicate of the whole site on a preview domain competes with the canonical
 * one for the queries that matter ("Jawad Nisar").
 */
const PREVIEW_HOST = /(^|\.)(vercel\.app|pages\.dev|netlify\.app|workers\.dev)$/i;
const LOCAL_HOST = /^(localhost|0\.0\.0\.0|127(\.\d+){3}|\[::1\])$/i;

/** True only for the real production origin. Preview and localhost are out. */
export function isIndexableOrigin(origin: string = siteUrl): boolean {
  let hostname: string;
  try {
    hostname = new URL(origin).hostname;
  } catch {
    return false;
  }
  return !LOCAL_HOST.test(hostname) && !PREVIEW_HOST.test(hostname);
}

// Frozen into robots.txt at build time; nothing here reads the request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // /explore stays crawlable on purpose: it is a 308 to "/", and blocking a
    // redirect stops crawlers from ever following it home.
    rules: isIndexableOrigin()
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
