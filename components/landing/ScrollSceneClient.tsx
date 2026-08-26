"use client";

import dynamic from "next/dynamic";
import { BackdropFallback } from "@/components/three/BackdropFallback";
import { useWebGLSupport } from "@/lib/webgl";

// SSR is disabled for the WebGL canvas — Three.js needs `window`.
// Loading state is `null` so the fallback field below shows through cleanly.
const ScrollScene = dynamic(
  () => import("./ScrollScene").then((m) => m.ScrollScene),
  { ssr: false, loading: () => null },
);

/**
 * The landing backdrop, gated on capability.
 *
 * `dynamic` alone only defers the download; it still happens on a machine
 * that cannot run a single fragment. The probe runs first, so three.js is
 * requested only once WebGL has answered — and the static field sits a layer
 * further back at all times, which is both the no-WebGL picture and the floor
 * under the canvas while its chunk is still arriving.
 */
export default function ScrollSceneMount() {
  const supported = useWebGLSupport();

  return (
    <>
      {/* One layer behind the canvas (-z-10) and the vignette above it. */}
      <BackdropFallback className="fixed inset-0 -z-20" />
      {supported ? <ScrollScene /> : null}
    </>
  );
}
