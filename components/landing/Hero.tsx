"use client";

import { motion, useReducedMotion } from "framer-motion";
import { bio } from "@/data/bio";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Index where the motto switches to italic display serif.
// "I architect the systems" | "other teams talk about."
const SERIF_FROM = 4;

export function Hero() {
  const reduce = useReducedMotion();
  const words = bio.motto.split(" ");
  const sublineDelay = 0.3 + words.length * 0.08 + 0.2;

  return (
    <header className="relative mb-8 max-w-5xl text-center sm:mb-16">
      {/* Nothing in the hero animates opacity: an element at opacity 0 is not
          an LCP candidate, so fading the headline in pushes LCP past hydration
          plus the full word stagger. Rising out of a blur reads the same and
          the text is painted from the first frame. The intro curtain sitting
          over it is occlusion, not transparency — LCP still counts it. */}
      <motion.p
        initial={reduce ? false : { filter: "blur(6px)" }}
        animate={{ filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-4 text-[10px] uppercase tracking-[0.35em] text-(--color-fg-muted) sm:mb-5 sm:text-xs"
      >
        {bio.name} — {bio.location}
      </motion.p>

      <h1 className="text-balance text-[2.35rem] font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl lg:text-[5.5rem]">
        {words.map((word, i) => {
          const isSerif = i >= SERIF_FROM;
          return (
            <motion.span
              key={`${word}-${i}`}
              initial={reduce ? false : { y: 30, filter: "blur(10px)" }}
              animate={{ y: 0, filter: "blur(0px)" }}
              transition={{
                duration: reduce ? 0.3 : 0.8,
                delay: reduce ? 0 : 0.3 + i * 0.08,
                ease: EASE_OUT,
              }}
              className={cn(
                "mr-[0.18em] inline-block",
                isSerif &&
                  "font-display italic font-normal text-(--color-accent-soft)",
              )}
            >
              {word}
            </motion.span>
          );
        })}
      </h1>

      <motion.p
        initial={reduce ? false : { y: 12 }}
        animate={{ y: 0 }}
        transition={{
          duration: reduce ? 0.3 : 0.6,
          delay: reduce ? 0 : sublineDelay,
          ease: EASE_OUT,
        }}
        className="mt-5 text-balance text-sm text-(--color-fg-muted) sm:mt-8 sm:text-base md:text-lg"
      >
        {bio.subline}
      </motion.p>
    </header>
  );
}
