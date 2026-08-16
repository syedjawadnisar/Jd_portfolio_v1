"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The single "leave this experience" control. One label, one type scale
 * across every route — the cinematic deck, the game, and the reward screen.
 */
export function BackLink({
  /** Use the per-stage accent (set by /play) instead of the global accent. */
  stageAccent = false,
  className,
}: {
  stageAccent?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      data-cursor="hover"
      className={cn(
        "text-[11px] uppercase tracking-[0.3em] text-[--color-fg-muted] transition-colors",
        stageAccent
          ? "hover:text-[--stage-accent]"
          : "hover:text-[--color-accent]",
        className,
      )}
    >
      ← back to home
    </Link>
  );
}
