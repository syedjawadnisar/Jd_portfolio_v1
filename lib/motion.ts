"use client";

import type { TargetAndTransition } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Motion primitives shared by every surface.
 *
 * The easing tuples are the site's signature curves — one definition, so a
 * tuning pass never leaves half the page on an old feel.
 */

/** Signature entrance ease — elements arrive and settle. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Accelerating exit — elements leave with momentum, not a fade-in-reverse. */
export const EXIT_EASE = [0.55, 0, 0.85, 0.4] as const;

/**
 * Live `prefers-reduced-motion` flag.
 *
 * Exists alongside framer-motion's `useReducedMotion` for R3F contexts:
 * `useFrame` callbacks read a plain boolean, not a motion-config value, and
 * the WebGL scenes are not always inside a MotionConfig provider. Use
 * framer-motion's hook inside DOM/motion components; use this one inside
 * anything that renders into a Canvas.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Coarse-pointer flag — used to cap canvas device-pixel-ratio, shader octave
 * count and antialiasing on phones, where the fragment-heavy silk shader is
 * the frame budget.
 *
 * The initial value is probed during the first render, not in the effect:
 * WebGL context options (antialias) are frozen when the context is created,
 * and a shader that recompiles one tick later throws away its first compile.
 * Every consumer sits behind a dynamic import with `ssr: false`, so the probe
 * never runs on the server; the listener still tracks live changes.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return coarse;
}

/** Canvas dpr range — halved on coarse pointers so mobile keeps its frame rate. */
export function canvasDpr(coarse: boolean): [number, number] {
  return coarse ? [1, 1.25] : [1, 1.75];
}

/**
 * Reduced-motion target for an element whose full-motion `initial` moves,
 * scales or blurs it. The server cannot know the visitor's motion setting,
 * so it renders that full-motion `initial`. A reduced target that only fades
 * opacity then leaves the offset or the blur exactly where the server put
 * it, so this settles all of them at once and fades opacity only.
 */
export function settled({
  opacity = 1,
  duration = 0.2,
  delay = 0,
  ...final
}: {
  opacity?: number;
  duration?: number;
  delay?: number;
  y?: number | string;
  letterSpacing?: string;
} = {}): TargetAndTransition {
  return {
    opacity,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    ...final,
    transition: { duration: 0, opacity: { duration, delay } },
  };
}
