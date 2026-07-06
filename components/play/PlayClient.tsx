"use client";

import dynamic from "next/dynamic";

// SSR is disabled — the experience mounts WebGL + physics and needs `window`.
const PlayExperience = dynamic(
  () => import("./PlayExperience").then((m) => m.PlayExperience),
  {
    ssr: false,
    loading: () => (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]">
          loading the course
        </p>
      </main>
    ),
  },
);

export default PlayExperience;
