"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Soft elliptical edge. The photo's own dark backdrop dissolves into the
 * shader behind it, so it never reads as a rectangle pasted onto the page.
 * The ellipse sits inside the frame on every side, so the fade reaches full
 * transparency before any edge: a radius that overshoots leaves a straight
 * line where the image ends.
 */
const FADE =
  "radial-gradient(ellipse 50% 47% at 50% 46%, #000 62%, transparent 98%)";

/**
 * The one photograph on the site. As the section scrolls in it comes into
 * focus out of the haze, a thin gold arc draws itself over the head, and the
 * frame drifts slightly with the scroll. Reduced motion gets the settled
 * frame: sharp, still, the arc already drawn.
 */
const noSubscription = () => () => {};

export function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  // The server cannot know the motion setting, so it renders the full-motion
  // start: hidden, blurred, arc undrawn. Hydration keeps those inline values
  // for opacity, filter and pathLength when the first client render passes
  // plain numbers, so the still frame waits until after hydration, when a
  // normal re-render does replace them.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const reduce = hydrated && Boolean(prefersReduced);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  const blur = useTransform(scrollYProgress, [0.05, 0.4], [14, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const scale = useTransform(scrollYProgress, [0.05, 0.45], [1.06, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const draw = useTransform(scrollYProgress, [0.18, 0.55], [0, 1]);

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem]"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: reduce ? 1 : opacity,
          filter: reduce ? "blur(0px)" : filter,
          scale: reduce ? 1 : scale,
          y: reduce ? 0 : y,
          maskImage: FADE,
          WebkitMaskImage: FADE,
        }}
      >
        <Image
          src="/images/portrait.webp"
          alt="Jawad Nisar, smiling and looking to the side, in a grey shirt against a dark background"
          fill
          sizes="(min-width: 768px) 28rem, (min-width: 640px) 24rem, 20rem"
          className="object-cover"
        />
      </motion.div>

      <svg
        aria-hidden
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <motion.path
          d="M 6 72 A 44 60 0 0 1 94 72"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.75}
          // In viewBox units, about 1.3px at full size. No non-scaling-stroke:
          // it breaks the dash maths that pathLength draws with.
          strokeWidth={0.3}
          strokeLinecap="round"
          style={{
            pathLength: reduce ? 1 : draw,
            filter:
              "drop-shadow(0 0 5px color-mix(in oklch, var(--color-accent) 65%, transparent))",
          }}
        />
      </svg>
    </div>
  );
}
