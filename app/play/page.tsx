import Link from "next/link";

export default function PlayPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[--color-fg-muted]">
        Path C — The Interactive Journey
      </p>
      <h1 className="text-balance text-center text-4xl font-semibold tracking-tight md:text-6xl">
        Mini platformer + mystery box — under construction.
      </h1>
      <p className="mt-6 max-w-xl text-center text-[--color-fg-muted]">
        Question → 4-obstacle platformer (Rapier physics) → animated cat → personalized mystery box.
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
