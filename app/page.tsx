import { bio } from "@/data/bio";
import { Hero } from "@/components/landing/Hero";
import { IntroOverlay } from "@/components/landing/IntroOverlay";
import { PathChooser } from "@/components/landing/PathChooser";
import HeroBackground from "@/components/three/HeroBackgroundClient";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <IntroOverlay />
      <HeroBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,oklch(0.22_0.04_270/0.55),transparent_60%)]"
      />

      <Hero />

      <PathChooser />

      <footer className="mt-20 text-xs uppercase tracking-widest text-[--color-fg-muted]">
        Choose your path. Or just say hi —{" "}
        <a
          href={`mailto:${bio.contact.email}`}
          data-cursor="hover"
          className="text-[--color-accent] underline-offset-4 hover:underline"
        >
          {bio.contact.email}
        </a>
      </footer>
    </main>
  );
}
