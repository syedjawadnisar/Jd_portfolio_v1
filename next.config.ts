import type { NextConfig } from "next";

/**
 * Response headers that are safe without a runtime test pass: none of them
 * change what the page is allowed to load, only how the browser is allowed to
 * treat it. Expressed through `next.config.ts` rather than a platform config
 * file so they travel with the app on either host.
 *
 * Deliberately absent: Content-Security-Policy. framer-motion writes inline
 * styles on every animated element and rapier instantiates WebAssembly, so a
 * policy needs `style-src 'unsafe-inline'` plus a wasm source at minimum —
 * and a wrong one silently blanks the experience. It needs a report-only
 * rollout against the real deployment, not a guess before the first deploy.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Both candidate hosts serve HTTPS only. No includeSubDomains and no
  // preload: neither is reversible on a timescale a portfolio can afford.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "framer-motion"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
