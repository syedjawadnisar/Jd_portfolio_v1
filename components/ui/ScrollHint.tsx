"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The shared "there is more below" affordance — one height, one amplitude,
 * one cadence, rendered by the landing hero and the cinematic CTA chapter.
 */
export function ScrollHint({
  label,
  tone = "accent",
  reduce = false,
  className,
}: {
  label: ReactNode;
  /** Line color: the gold accent, or the quieter muted rule. */
  tone?: "accent" | "muted";
  reduce?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[--color-fg-muted]">
        {label}
      </p>
      <motion.span
        aria-hidden
        className={cn(
          "mt-4 block h-9 w-px bg-gradient-to-b to-transparent sm:h-12",
          tone === "accent"
            ? "from-[--color-accent]/70"
            : "from-[--color-fg-muted]",
        )}
        style={{ transformOrigin: "top" }}
        animate={
          reduce ? undefined : { scaleY: [0.4, 1, 0.4], opacity: [0.5, 1, 0.5] }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
