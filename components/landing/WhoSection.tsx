"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";
import { Portrait } from "./Portrait";

/**
 * The "who" chapter, the one section with a face in it: the portrait beside
 * the copy on wide screens, above it on phones. Same label and title styles
 * as Section, so the narrative keeps one voice.
 */
export function WhoSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center px-6 py-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
        <Portrait />

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduce ? 0.2 : 0.85, ease: EASE_OUT }}
          className="text-center md:text-left"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-(--color-fg-muted)">
            {label}
          </p>
          <h2 className="mb-8 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
