"use client";

import dynamic from "next/dynamic";

// SSR is disabled for the WebGL canvas — Three.js needs `window`.
// Loading state is `null` so the page background shows through cleanly.
const SilkBackground = dynamic(
  () => import("./SilkBackground").then((m) => m.SilkBackground),
  { ssr: false, loading: () => null },
);

export default SilkBackground;
