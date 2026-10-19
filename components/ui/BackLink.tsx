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
        // The visible label is ~13px tall and unpadded, which on /play and
        // /cinematic put a sub-44px touch target next to another control (and
        // directly over the deck's "previous chapter" zone). The hit area is
        // expanded with a pseudo-element rather than padding: this link is
        // absolutely positioned on both of those routes, so padding would
        // move the label. tailwind-merge drops `relative` when a caller passes
        // its own position class, which already establishes the containing
        // block the pseudo-element needs.
        "relative inline-flex items-center after:absolute after:-inset-x-3 after:-inset-y-4 after:content-['']",
        "text-[11px] uppercase tracking-[0.3em] text-(--color-fg-muted) transition-colors",
        stageAccent
          ? "hover:text-(--stage-accent)"
          : "hover:text-(--color-accent)",
        className,
      )}
    >
      ← back to home
    </Link>
  );
}
