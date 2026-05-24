"use client";

import dynamic from "next/dynamic";

// SSR is disabled for the WebGL canvas — Three.js needs `window`.
// Loading state is `null` so the radial gradient underneath shows through cleanly.
const HeroBackground = dynamic(
  () => import("./Background").then((m) => m.HeroBackground),
  { ssr: false, loading: () => null },
);

export default HeroBackground;
