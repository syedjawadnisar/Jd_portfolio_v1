import Link from "next/link";

export default function CinematicPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[--color-fg-muted]">
        Path A — Cinematic Auto-Play
      </p>
      <h1 className="text-balance text-center text-4xl font-semibold tracking-tight md:text-6xl">
        60-second cinematic — under construction.
      </h1>
      <p className="mt-6 max-w-xl text-center text-[--color-fg-muted]">
        Hands-free slideshow with progress bar, time indicator, and a hard CTA at the end.
      </p>
      <Link
        href="/"
        className="mt-10 text-sm uppercase tracking-widest text-[--color-accent] hover:underline"
      >
        ← Back to home
      </Link>
    </main>
  );
}
