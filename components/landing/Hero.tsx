"use client";

import { motion } from "framer-motion";
import { bio } from "@/data/bio";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const words = bio.motto.split(" ");
  const sublineDelay = 0.3 + words.length * 0.08 + 0.2;

  return (
    <header className="relative mb-14 max-w-4xl text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-4 text-sm uppercase tracking-[0.3em] text-[--color-fg-muted]"
      >
        {bio.name} — {bio.location}
      </motion.p>

      <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.75,
              delay: 0.3 + i * 0.08,
              ease: easeOut,
            }}
            className="mr-[0.25em] inline-block"
          >
            {word}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: sublineDelay, ease: easeOut }}
        className="mt-6 text-balance text-base text-[--color-fg-muted] md:text-lg"
      >
        {bio.subline}
      </motion.p>
    </header>
  );
}
