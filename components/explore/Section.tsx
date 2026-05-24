"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

type SectionProps = {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  align?: "start" | "center";
};

export function Section({
  label,
  title,
  children,
  className,
  align = "center",
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col px-6 py-24",
        align === "center" ? "items-center justify-center" : "items-start justify-center",
        className,
      )}
    >
      <motion.div
        className={cn("w-full max-w-4xl", align === "center" && "text-center")}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease: easeOut }}
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
