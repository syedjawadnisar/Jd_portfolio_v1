"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "@/lib/lenis";
import ScrollScene from "./ScrollSceneClient";
import { Section } from "./Section";
import { skillCategories } from "@/data/skills";
import { featuredProjects } from "@/data/projects";
import { JourneyFooter } from "@/components/footer/JourneyFooter";
import { yearsWord } from "@/lib/experience";
import { useExperienceYears } from "@/lib/experience-client";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function ExploreExperience() {
  useLenis();
  const years = useExperienceYears();
  const reduce = useReducedMotion() ?? false;

  return (
    <main className="relative">
      <ScrollScene />

      {/* Top nav-back, fixed so it's always reachable */}
      <Link
        href="/"
        data-cursor="hover"
        className="fixed left-6 top-6 z-50 text-xs uppercase tracking-widest text-[--color-fg-muted] transition-colors hover:text-[--color-accent]"
      >
        ← back
      </Link>

      {/* Section 1 — Hero */}
      <Section label="Path B — The Architect's Scroll" title="Set your own pace.">
        <p className="mx-auto max-w-2xl text-balance text-lg text-[--color-fg-muted] md:text-xl">
          The particles follow your scroll. The story does too.
        </p>
        <motion.div
          aria-hidden
          className="mt-16 flex flex-col items-center text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          scroll
          <motion.span
            className="mt-3 block h-10 w-px bg-[--color-fg-muted]"
            animate={reduce ? undefined : { scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </Section>

      {/* Section 2 — Bio */}
      <Section
        label="01 — Who"
        title={`Lahore. ${yearsWord(years)} years deep. Lead-tier scope.`}
      >
        <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-[--color-fg-muted]">
          I&apos;ve been shipping production systems since 2021 — billing flows that
          move money across borders, AI agents that hold conversations, data pipelines
          that don&apos;t flinch under load. Currently running four projects at once
          under names that read &ldquo;ten years experience.&rdquo; The years aren&apos;t
          the story. The output is.
        </p>
      </Section>

      {/* Section 3 — AI superpower */}
      <Section
        label="02 — The superpower"
        title="I don't just use AI. I architect with it."
      >
        <div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-[--color-fg-muted]">
          <p>
            Two years ago, AI was a tool I reached for to solve discrete problems.
          </p>
          <p>
            Today it&apos;s the layer that makes my infrastructure self-aware —
            error-handling that diagnoses itself, pipelines that route around their
            own failures, agents that turn fuzzy intent into reliable side effects.
          </p>
          <p className="text-[--color-fg]">
            The systems I ship are smarter on their worst day than yesterday&apos;s
            were on their best.
          </p>
        </div>
      </Section>

      {/* Section 4 — Stack */}
      <Section label="03 — Stack" title="The tools that ship.">
        <div className="grid w-full grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: easeOut }}
              className="rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/50 p-6 backdrop-blur-sm"
            >
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[--color-accent]">
                {cat.label}
              </p>
              <ul className="space-y-1.5 text-sm text-[--color-fg]">
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Section 5 — Featured work */}
      <Section label="04 — Featured work" title="Five systems. Five problems solved.">
        <div className="space-y-5 text-left">
          {featuredProjects.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: easeOut }}
              className="rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/50 p-6 backdrop-blur-sm md:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {p.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.25em] text-[--color-fg-muted]">
                  {p.domain}
                </p>
              </div>
              <p className="mt-4 text-base leading-relaxed text-[--color-fg-muted]">
                {p.impact}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-[--color-border] px-3 py-1 text-xs text-[--color-fg-muted]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* Section 6 — Agile */}
      <Section
        label="05 — Workflow"
        title="Workflows that ship — not slides about workflows."
      >
        <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-[--color-fg-muted]">
          Jira, Asana, Zendesk, GitHub Actions — pick the cadence, I&apos;ll run it.
          Sprints that move. Retros that change behavior. Dashboards that tell
          the truth. The methodology matters less than the rhythm I bring to it.
        </p>
      </Section>

      {/* Section 7 — Journey footer + contact game */}
      <JourneyFooter />
    </main>
  );
}
