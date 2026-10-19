"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { paths } from "@/data/bio";
import { EASE_OUT } from "@/lib/motion";

export function PathChooser() {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 md:gap-6">
      {paths.map((path, idx) => (
        <motion.div
          key={path.href}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4 + idx * 0.12,
            duration: 0.7,
            ease: EASE_OUT,
          }}
          whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
        >
          <Link
            href={path.href}
            data-cursor="hover"
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-elevated)/60 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-(--color-accent) sm:rounded-3xl sm:p-8 md:p-10"
          >
            {/* Hover shimmer */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-(--color-accent)/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />

            <div className="relative flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-(--color-fg-muted)">
              <span>{path.label}</span>
              <span>{path.duration}</span>
            </div>

            <h2 className="relative mt-3 flex items-center justify-between gap-4 text-xl font-semibold leading-tight tracking-tight text-(--color-fg) sm:mt-6 sm:block sm:text-3xl md:text-4xl">
              {path.title}
              <span
                aria-hidden
                className="text-lg text-(--color-accent) transition-transform duration-300 group-hover:translate-x-1.5 sm:hidden"
              >
                →
              </span>
            </h2>

            <p className="relative mt-2 text-sm leading-relaxed text-(--color-fg-muted) sm:mt-4 sm:text-base">
              {path.description}
            </p>

            <div className="relative mt-auto hidden items-center gap-2 pt-8 text-sm font-medium uppercase tracking-[0.2em] text-(--color-accent) opacity-80 transition-opacity group-hover:opacity-100 sm:flex">
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
