"use client";

import { motion } from "framer-motion";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

// Index where the motto switches to italic display serif.
// "I architect the systems" | "other teams talk about."
const SERIF_FROM = 4;

export function Hero() {
  const words = bio.motto.split(" ");
  const sublineDelay = 0.3 + words.length * 0.08 + 0.2;

  return (
    <header className="relative mb-16 max-w-5xl text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-5 text-xs uppercase tracking-[0.35em] text-[--color-fg-muted]"
      >
        {bio.name} — {bio.location}
      </motion.p>

      <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]">
        {words.map((word, i) => {
          const isSerif = i >= SERIF_FROM;
          return (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.3 + i * 0.08,
                ease: easeOut,
              }}
              className={cn(
                "mr-[0.18em] inline-block",
                isSerif &&
                  "font-display italic font-normal text-[--color-accent-soft]",
              )}
            >
              {word}
            </motion.span>
          );
        })}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: sublineDelay, ease: easeOut }}
        className="mt-8 text-balance text-base text-[--color-fg-muted] md:text-lg"
      >
        {bio.subline}
      </motion.p>
    </header>
  );
}
