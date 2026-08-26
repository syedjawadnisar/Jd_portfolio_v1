"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useWebGLSupport } from "@/lib/webgl";
import { BackdropFallback } from "./BackdropFallback";
import type { SilkBackgroundProps } from "./SilkBackground";

// SSR is disabled for the WebGL canvas — Three.js needs `window`.
// Loading state is `null` so the fallback field below shows through cleanly.
const SilkBackground = dynamic(
  () => import("./SilkBackground").then((m) => m.SilkBackground),
  { ssr: false, loading: () => null },
);

/**
 * The silk backdrop, gated on capability. Same contract as the landing's
 * scroll scene: probe first so a machine with no WebGL never pays for
 * three.js, and keep a static field one layer further back so the deck's type
 * always has a composed ground under it — before the chunk lands, after a
 * lost context, or forever on a device that cannot render it.
 *
 * `import type` for the props: the value import is the dynamic one, and a
 * plain `import` here would defeat the whole gate by pulling the module in.
 */
export default function SilkBackgroundMount({
  variant,
  className,
}: SilkBackgroundProps) {
  const supported = useWebGLSupport();

  return (
    <>
      {/* The canvas defaults to -z-20, so the field sits at -z-30. */}
      <BackdropFallback className={cn("absolute inset-0 -z-30", className)} />
      {supported ? (
        <SilkBackground variant={variant} className={className} />
      ) : null}
    </>
  );
}
