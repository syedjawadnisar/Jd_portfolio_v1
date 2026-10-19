"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "@/lib/lenis";
import { Hero } from "./Hero";
import { IntroOverlay } from "./IntroOverlay";
import { PathChooser } from "./PathChooser";
import { ProjectsSection } from "./ProjectsSection";
import { ScrollCue } from "./ScrollCue";
import { Section } from "./Section";
import ScrollScene from "./ScrollSceneClient";
import { skillCategories } from "@/data/skills";
import { JourneyFooter } from "@/components/footer/JourneyFooter";
import { numberWord } from "@/lib/experience";
import { useExperienceYears } from "@/lib/experience-client";
import { EASE_OUT } from "@/lib/motion";

export function LandingExperience() {
  useLenis();
  const reduce = useReducedMotion();
  const years = useExperienceYears();

  return (
    <main className="relative landing-tree">
      {/* Without JS every reveal on this page stays at its `initial` state —
          inline opacity 0, a translate, a blur — and the route paints as a bare
          rectangle. This neutralises those inline values, scoped to the landing
          tree: /cinematic parks its inactive chapters at opacity 0 and would
          stack all of them if the same rule were global. Serialized inline
          styles are the only thing matched, so class-driven transforms (the
          contact game's card backs) keep theirs. */}
      <noscript>
        <style>{`.landing-tree [style*="opacity:0"],.landing-tree [style*="translate"],.landing-tree [style*="blur("]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
      </noscript>

      <IntroOverlay />

      {/* Single canvas for the whole route — silk + scroll-reactive particles. */}
      <ScrollScene />

      {/* Vignette sits above the canvas, below the content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklch,var(--color-bg-elevated)_55%,transparent),transparent_60%)]"
      />

      {/* First viewport — hero, the two paths, and the invitation to scroll */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-10 sm:py-16">
        <Hero />
        <PathChooser />
        <ScrollCue />
      </section>

      {/* Everything below is the default experience: the full scroll narrative */}

      <Section
        label="01 — Who"
        title={`Lahore. ${numberWord(years)} years deep. Lead-tier scope.`}
      >
        <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-(--color-fg-muted)">
          I&apos;ve been shipping production systems since 2021 — billing flows that
          move money across borders, AI agents that hold conversations, data pipelines
          that don&apos;t flinch under load. Currently running four projects at once
          under names that read &ldquo;ten years experience.&rdquo; The years aren&apos;t
          the story. The output is.
        </p>
      </Section>

      <Section
        label="02 — The superpower"
        title="I don't just use AI. I architect with it."
      >
        <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-(--color-fg-muted)">
          <p>
            Two years ago, AI was a tool I reached for to solve discrete problems.
          </p>
          <p>
            Today it&apos;s the layer that makes my infrastructure self-aware —
            error-handling that diagnoses itself, pipelines that route around their
            own failures, agents that turn fuzzy intent into reliable side effects.
          </p>
          <p className="text-(--color-fg)">
            The systems I ship are smarter on their worst day than yesterday&apos;s
            were on their best.
          </p>
        </div>
      </Section>

      <Section label="03 — Stack" title="The tools that ship.">
        <div className="grid w-full grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reduce ? 0.2 : 0.6,
                delay: reduce ? 0 : i * 0.08,
                ease: EASE_OUT,
              }}
              className="rounded-2xl border border-(--color-border) bg-(--color-bg-elevated)/50 p-6 backdrop-blur-sm"
            >
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-(--color-accent)">
                {cat.label}
              </p>
              <ul className="space-y-1.5 text-sm text-(--color-fg)">
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      <ProjectsSection />

      <Section
        label="05 — Workflow"
        title="Workflows that ship — not slides about workflows."
      >
        <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-(--color-fg-muted)">
          Jira, Asana, Zendesk, GitHub Actions — pick the cadence, I&apos;ll run it.
          Sprints that move. Retros that change behavior. Dashboards that tell
          the truth. The methodology matters less than the rhythm I bring to it.
        </p>
      </Section>

      <JourneyFooter />
    </main>
  );
}
