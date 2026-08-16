"use client";

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
 * Coarse-pointer flag — used to cap canvas device-pixel-ratio on phones,
 * where the fragment-heavy silk shader is the frame budget.
 */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
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
