"use client";

import Link from "next/link";
import { bio } from "@/data/bio";

/**
 * Route-level recovery. The WebGL/physics trees can throw at runtime — a
 * failed WASM fetch, a shader that will not link — and without a boundary
 * the whole tree unmounts into the framework's default error page.
 */
export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/60 p-8 text-center backdrop-blur-sm md:p-10">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]">
          Something broke mid-flight
        </p>
        <h1 className="text-balance font-display text-3xl italic tracking-tight md:text-4xl">
          Even good systems fall over. This one tells you about it.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[--color-fg-muted]">
          Try again — most of the time it comes straight back. If it
          doesn&apos;t, the conversation was always the point.
        </p>

        <button
          type="button"
          onClick={reset}
          data-cursor="hover"
          className="mt-8 rounded-full border border-[--color-accent] bg-[--color-accent]/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[--color-accent] transition-colors hover:bg-[--color-accent]/20"
        >
          Try again
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${bio.contact.email}`}
            data-cursor="hover"
            className="text-[11px] uppercase tracking-[0.3em] text-[--color-fg-muted] transition-colors hover:text-[--color-accent]"
          >
            {bio.contact.email}
          </a>
          <Link
            href="/"
            data-cursor="hover"
            className="text-[11px] uppercase tracking-[0.3em] text-[--color-fg-muted] transition-colors hover:text-[--color-accent]"
          >
            ← back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
