"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { paths } from "@/data/bio";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function PathChooser() {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
      {paths.map((path, idx) => (
        <motion.div
          key={path.href}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4 + idx * 0.12,
            duration: 0.7,
            ease: easeOut,
          }}
          whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
        >
          <Link
            href={path.href}
            data-cursor="hover"
            className="group relative block h-full overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-[--color-accent]"
          >
            {/* Hover shimmer */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[--color-accent]/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />

            <div className="relative flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[--color-fg-muted]">
              <span>{path.label}</span>
              <span>{path.duration}</span>
            </div>

            <h3 className="relative mt-5 text-2xl font-semibold tracking-tight text-[--color-fg]">
              {path.title}
            </h3>

            <p className="relative mt-3 text-sm leading-relaxed text-[--color-fg-muted]">
              {path.description}
            </p>

            <div className="relative mt-7 flex items-center gap-2 text-sm font-medium text-[--color-accent] opacity-80 transition-opacity group-hover:opacity-100">
              Enter
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
