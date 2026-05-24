"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { paths } from "@/data/bio";

export function PathChooser() {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
      {paths.map((path, idx) => (
        <motion.div
          key={path.href}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + idx * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={path.href}
            className="group relative block h-full overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/60 p-6 backdrop-blur-sm transition-colors hover:border-[--color-accent]"
          >
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[--color-fg-muted]">
              <span>{path.label}</span>
              <span>{path.duration}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[--color-fg]">
              {path.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[--color-fg-muted]">
              {path.description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[--color-accent] opacity-80 transition-opacity group-hover:opacity-100">
              Enter
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
