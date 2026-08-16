"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import type { ReactNode } from "react";

type SectionProps = {
  label?: string;
  title?: string;
  children: ReactNode;
};

export function Section({ label, title, children }: SectionProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <motion.div
        className="w-full max-w-4xl text-center"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduce ? 0.2 : 0.85, ease: EASE_OUT }}
      >
        {label && (
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]">
            {label}
          </p>
        )}
        {title && (
          <h2 className="mb-8 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {title}
          </h2>
        )}
        {children}
      </motion.div>
    </section>
  );
}
