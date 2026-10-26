import type { NextConfig } from "next";

/**
 * Static export for Cloudflare Pages: `next build` writes plain HTML, CSS and
 * JS to `out/`, and nothing runs on a server.
 *
 * What follows from that:
 *  - Response headers and the /explore redirect live in `public/_headers` and
 *    `public/_redirects`, which Pages reads. `headers()` and `redirects()`
 *    here would not reach an export.
 *  - next/image has no optimizer, hence `unoptimized`. Images ship pre-sized.
 *  - `trailingSlash` writes each route as `<route>/index.html`, which Pages
 *    resolves without guesswork and reaches from `/play` with a 308. The
 *    canonical URLs and the sitemap carry the slash, so none points at a
 *    redirect.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,

  experimental: {
    // `three` is deliberately absent: the flag rewrites named imports into
    // deep paths, and every three consumer here does `import * as THREE`,
    // which it cannot touch. drei and framer-motion are both barrel packages
    // imported by name, so they are the two that actually benefit.
    optimizePackageImports: ["@react-three/drei", "framer-motion"],
  },
};

export default nextConfig;
