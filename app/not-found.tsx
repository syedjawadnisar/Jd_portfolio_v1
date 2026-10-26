import type { Metadata } from "next";
import Link from "next/link";
import { bio, paths } from "@/data/bio";

export const metadata: Metadata = {
  title: "No such route",
  description: "That address doesn't resolve. These three do.",
};

/**
 * Without this file the framework's own 404 ships, and it injects an inline
 * `body { color: #000; background: #fff }` after the stylesheet — a white page
 * on a near-black site, with its own <title> stacked on top of the layout's.
 * Server component, no WebGL: a 404 should paint instantly.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg rounded-2xl border border-(--color-border) bg-(--color-bg-elevated)/60 p-8 text-center backdrop-blur-sm md:p-10">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-(--color-fg-muted)">
          404 — no such route
        </p>
        <h1 className="text-balance font-display text-3xl italic tracking-tight md:text-4xl">
          This address doesn&apos;t resolve. The work does.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-(--color-fg-muted)">
          Nothing lives here — the link either aged out or was never a route.
          Every way in is one click away.
        </p>

        <Link
          href="/"
          data-cursor="hover"
          className="mt-8 inline-block rounded-full border border-(--color-accent) bg-(--color-accent)/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-(--color-accent) transition-colors hover:bg-(--color-accent)/20"
        >
          Back to home
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              data-cursor="hover"
              className="text-[11px] uppercase tracking-[0.3em] text-(--color-fg-muted) transition-colors hover:text-(--color-accent)"
            >
              {path.label}
            </Link>
          ))}
          <a
            href={`mailto:${bio.contact.email}`}
            data-cursor="hover"
            className="text-[11px] uppercase tracking-[0.3em] text-(--color-fg-muted) transition-colors hover:text-(--color-accent)"
          >
            {bio.contact.email}
          </a>
        </div>
      </div>
    </main>
  );
}
