"use client";

import dynamic from "next/dynamic";

// SSR is disabled for the WebGL canvas — Three.js needs `window`.
// Loading state is `null` so the page background shows through cleanly.
const ScrollScene = dynamic(
  () => import("./ScrollScene").then((m) => m.ScrollScene),
  { ssr: false, loading: () => null },
);

export default ScrollScene;
