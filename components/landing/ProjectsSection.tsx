"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { featuredProjects, type Project } from "@/data/projects";
import { numberWord } from "@/lib/experience";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./ProjectVisual";

/** Heading copy stays true to the data, however many projects there are. */
function headingFor(count: number) {
  const word = numberWord(count);
  return count === 1
    ? `${word} system. ${word} problem solved.`
    : `${word} systems. ${word} problems solved.`;
}

function ProjectRow({
  project,
  index,
  flipped,
}: {
  project: Project;
  index: number;
  flipped: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [14, -14]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
  };

  const item: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
      };

  const visual: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 40, scale: 0.97 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.9, ease: EASE_OUT },
        },
      };

  return (
    <motion.article
      ref={ref}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      {/* Visual */}
      <motion.div
        style={reduceMotion ? undefined : { y: visualY }}
        className={cn("lg:col-span-7", flipped ? "lg:order-2" : "lg:order-1")}
      >
        <motion.div variants={visual}>
          <ProjectVisual
            name={project.name}
            image={project.image}
            imageAlt={project.imageAlt}
            accent={project.accent}
            priority={index === 0}
          />
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={reduceMotion ? undefined : { y: contentY }}
        className={cn("lg:col-span-5", flipped ? "lg:order-1" : "lg:order-2")}
      >
        <motion.p
          variants={item}
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[--color-fg-muted]"
        >
          <span className="text-[--color-accent]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-px w-6 bg-[--color-border]" />
          {project.domain}
        </motion.p>

        <motion.h3
          variants={item}
          className="mt-4 text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-5xl"
        >
          {project.name}
        </motion.h3>

        <motion.p
          variants={item}
          className="mt-5 text-base leading-relaxed text-[--color-fg-muted] md:text-lg"
        >
          {project.impact}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 border-l-2 border-[--color-accent]/60 pl-4 text-sm leading-relaxed text-[--color-accent-soft]"
        >
          {project.role}
        </motion.p>

        <motion.ul variants={item} className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-[--color-border] bg-[--color-bg-elevated]/50 px-3 py-1 text-xs text-[--color-fg-muted] backdrop-blur-sm"
            >
              {s}
            </li>
          ))}
        </motion.ul>

        {project.url && (
          <motion.p variants={item} className="mt-6">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[--color-border] px-5 text-sm text-[--color-fg-muted] transition-colors hover:border-[--color-accent] hover:text-[--color-accent]"
            >
              {new URL(project.url).hostname.replace(/^www\./, "")}
              <span aria-hidden>↗</span>
            </a>
          </motion.p>
        )}
      </motion.div>
    </motion.article>
  );
}

export function ProjectsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <motion.header
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.85, ease: EASE_OUT }}
          className="mb-16 text-center md:mb-24"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]">
            04 — Featured work
          </p>
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {headingFor(featuredProjects.length)}
          </h2>
        </motion.header>

        <div className="space-y-24 md:space-y-36">
          {featuredProjects.map((project, i) => (
            <ProjectRow
              key={project.name}
              project={project}
              index={i}
              flipped={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
