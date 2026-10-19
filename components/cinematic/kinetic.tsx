"use client";

import { useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  type TargetAndTransition,
} from "framer-motion";
import type { SlideSegment } from "@/data/slides";
import { EASE_OUT, EXIT_EASE, settled } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Signature ease — the site-wide curve, re-exported under the deck's name. */
export const EASE = EASE_OUT;
export { EXIT_EASE };

/** Shared exit target — staggered, blurred momentum lift. */
export function exitUp(reduce: boolean, order = 0): TargetAndTransition {
  return reduce
    ? { opacity: 0, transition: { duration: 0.3 } }
    : {
        opacity: 0,
        y: -26,
        filter: "blur(9px)",
        transition: { duration: 0.5, delay: order * 0.035, ease: EXIT_EASE },
      };
}

/* ------------------------------------------------------------------ */
/* Kinetic heading — every word is its own staged actor.               */
/* ------------------------------------------------------------------ */

type KineticWord = { text: string; serif: boolean };

function splitSegments(segments: readonly SlideSegment[]): KineticWord[] {
  return segments.flatMap((seg) =>
    seg.text
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, serif: Boolean(seg.serif) })),
  );
}

export function KineticHeading({
  segments,
  reduce,
  baseDelay = 0.3,
  stagger = 0.08,
  as: Tag = "h2",
  className,
}: {
  segments: readonly SlideSegment[];
  reduce: boolean;
  baseDelay?: number;
  stagger?: number;
  /** The deck's first chapter carries the route's h1. */
  as?: "h1" | "h2";
  className?: string;
}) {
  const words = splitSegments(segments);
  return (
    <Tag
      className={cn(
        "text-balance font-semibold tracking-tight",
        className,
      )}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word.text}-${i}`}
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: "0.65em", scale: 1.12, filter: "blur(14px)" }
          }
          animate={
            reduce
              ? settled({ y: "0em", duration: 0.5, delay: 0.15 })
              : {
                  opacity: 1,
                  y: "0em",
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 1.05,
                    delay: baseDelay + i * stagger,
                    ease: EASE,
                  },
                }
          }
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.3 } }
              : {
                  opacity: 0,
                  y: "-0.55em",
                  filter: "blur(10px)",
                  transition: {
                    duration: 0.5,
                    delay: i * 0.03,
                    ease: EXIT_EASE,
                  },
                }
          }
          className={cn(
            "mr-[0.2em] inline-block will-change-transform",
            word.serif &&
              "font-display italic font-normal text-(--color-accent-soft)",
          )}
        >
          {word.text}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* DriftLayer — a slow, continuous parallax pass for the chapter's     */
/* whole lifetime. Different layers get different velocities so lines  */
/* slide past each other instead of sitting still.                     */
/* ------------------------------------------------------------------ */

export function DriftLayer({
  driftX = 0,
  driftY = 0,
  duration,
  reduce,
  className,
  style,
  children,
}: {
  /** Total horizontal travel in px over the chapter (positive = rightward). */
  driftX?: number;
  /** Total upward travel in px over the chapter (positive = rises). */
  driftY?: number;
  /** Chapter length in seconds. */
  duration: number;
  reduce: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (driftX === 0 && driftY === 0) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  // Under reduced motion this stays a motion.div and snaps to rest. A plain
  // div would hydrate over the server's drift offset and keep it for good.
  return (
    <motion.div
      initial={{ x: -driftX / 2, y: driftY / 2 }}
      animate={
        reduce
          ? { x: 0, y: 0, transition: { duration: 0 } }
          : { x: driftX / 2, y: -driftY / 2 }
      }
      transition={{ duration, ease: "linear" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — key numbers spring from zero. Instant under reduced       */
/* motion.                                                             */
/* ------------------------------------------------------------------ */

export function CountUp({
  value,
  delay = 0,
  reduce,
}: {
  value: number;
  /** Seconds before the spring is released. */
  delay?: number;
  reduce: boolean;
}) {
  const spring = useSpring(reduce ? value : 0, {
    stiffness: 46,
    damping: 15,
    mass: 1,
  });
  const text = useTransform(spring, (v) => String(Math.round(v)));

  useEffect(() => {
    if (reduce) {
      spring.jump(value);
      return;
    }
    const t = window.setTimeout(
      () => spring.set(value),
      Math.round(delay * 1000),
    );
    return () => window.clearTimeout(t);
  }, [spring, value, delay, reduce]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}
