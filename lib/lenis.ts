"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const progressRef = { current: 0 };

export const getScrollProgress = (): number => progressRef.current;

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    const onScroll = (e: { scroll: number; limit: number }) => {
      progressRef.current = e.limit > 0 ? e.scroll / e.limit : 0;
    };
    lenis.on("scroll", onScroll);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      progressRef.current = 0;
    };
  }, []);
}
