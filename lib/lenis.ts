"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const progressRef = { current: 0 };

export const getScrollProgress = (): number => progressRef.current;

export function useLenis() {
  useEffect(() => {
    // Smoothing is itself an animation. Under prefers-reduced-motion the page
    // scrolls natively and a plain listener keeps getScrollProgress() alive
    // for the scroll-driven WebGL scene.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const readProgress = () => {
        const limit =
          document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current = limit > 0 ? window.scrollY / limit : 0;
      };
      readProgress();
      window.addEventListener("scroll", readProgress, { passive: true });
      window.addEventListener("resize", readProgress);
      return () => {
        window.removeEventListener("scroll", readProgress);
        window.removeEventListener("resize", readProgress);
        progressRef.current = 0;
      };
    }

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
