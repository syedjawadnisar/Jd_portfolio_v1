"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { BackLink } from "@/components/ui/BackLink";
import { earlierWork, projects, type Project } from "@/data/projects";
import { EASE_OUT, settled } from "@/lib/motion";

/** Cards carry fewer chips than the landing rows, because the grid is denser. */
const CARD_STACK_LIMIT = 5;

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function ProjectCard({ project, column }: { project: Project; column: number }) {
  const reduce = useReducedMotion();

  const reveal: Variants = reduce
    ? { hidden: { opacity: 0 }, show: settled() }
    : {
        hidden: { opacity: 0, y: 26 },
        show: {
          opacity: 1,
          y: 0,
          // The right-hand card of a row lands a beat after the left one.
          transition: { duration: 0.7, delay: column * 0.08, ease: EASE_OUT },
        },
      };

  return (
    <motion.li
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="h-full"
    >
      <article className="flex h-full flex-col rounded-3xl border border-(--color-border) bg-(--color-bg-elevated)/40 p-7 backdrop-blur-sm md:p-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.3em] text-(--color-fg-muted)">
          <span>{project.domain}</span>
          {project.period && (
            <>
              <span aria-hidden className="h-px w-4 bg-(--color-border)" />
              <span>{project.period}</span>
            </>
          )}
          {project.featured && (
            <span className="text-(--color-accent)">Featured</span>
          )}
        </p>

        <h2 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {project.name}
        </h2>

        <p className="mt-4 text-base leading-relaxed text-(--color-fg-muted)">
          {project.impact}
        </p>

        <p className="mt-4 border-l-2 border-(--color-accent)/60 pl-4 text-sm leading-relaxed text-(--color-accent-soft)">
          {project.role}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.slice(0, CARD_STACK_LIMIT).map((s) => (
            <li
              key={s}
              className="rounded-full border border-(--color-border) bg-(--color-bg-elevated)/50 px-3 py-1 text-xs text-(--color-fg-muted)"
            >
              {s}
            </li>
          ))}
          {project.stack.length > CARD_STACK_LIMIT && (
            <li className="px-1 py-1 text-xs text-(--color-fg-muted)">
              +{project.stack.length - CARD_STACK_LIMIT} more
            </li>
          )}
        </ul>

        {project.url && (
          <p className="mt-auto pt-6">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--color-border) px-5 text-sm text-(--color-fg-muted) transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
            >
              {hostOf(project.url)}
              <span aria-hidden>↗</span>
            </a>
          </p>
        )}
      </article>
    </motion.li>
  );
}

/**
 * The full index behind the landing's "See all projects". The landing keeps
 * its six large rows for impact, this page answers "what else", featured
 * first and in the same order.
 */
export function ProjectsIndex() {
  const reduce = useReducedMotion();

  return (
    <section className="relative px-6 pb-24 pt-28 md:pb-32 md:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_55%_at_18%_0%,color-mix(in_oklch,var(--color-accent)_10%,transparent),transparent)]"
      />
      <BackLink className="absolute left-6 top-6 z-10" />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.header
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.2 : 0.85, ease: EASE_OUT }}
          className="mb-16 max-w-3xl md:mb-20"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-(--color-fg-muted)">
            Index — all work
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Every system,{" "}
            <span className="font-display font-normal italic text-(--color-accent-soft)">
              in one place.
            </span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-(--color-fg-muted) md:text-lg">
            {projects.length} projects, each with what was built, where, and on
            what stack. The six from the home page come first.
          </p>
        </motion.header>

        <ul className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} column={i % 2} />
          ))}
        </ul>

        <p className="mt-16 max-w-3xl text-sm leading-relaxed text-(--color-fg-muted)">
          {earlierWork}
        </p>
      </div>
    </section>
  );
}
