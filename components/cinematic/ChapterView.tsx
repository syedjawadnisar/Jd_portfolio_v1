"use client";

import { motion } from "framer-motion";
import { bio } from "@/data/bio";
import { featuredProjects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { YEARS_TOKEN, type Slide, type SlideItem } from "@/data/slides";
import { numberWord } from "@/lib/experience";
import { useExperienceYears } from "@/lib/experience-client";
import { cn } from "@/lib/utils";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { CountUp, DriftLayer, EASE, KineticHeading, exitUp } from "./kinetic";

/* ------------------------------------------------------------------ */
/* Static counts for the count-up row — single sources of truth.       */
/* The experience number is date-dependent and comes from              */
/* useExperienceYears() at render.                                     */
/* ------------------------------------------------------------------ */

const SKILL_COUNT = skillCategories.reduce((n, c) => n + c.items.length, 0);

/* ------------------------------------------------------------------ */
/* Skill stream — words drift across depth layers instead of a list.   */
/* ------------------------------------------------------------------ */

const DEPTH_OPACITY = [0.92, 0.58, 0.36] as const;
const DEPTH_BLUR = [0, 1.5, 2.5] as const;
const DEPTH_SIZE = [
  "text-xl md:text-3xl font-semibold tracking-tight",
  "text-lg md:text-xl font-medium",
  "text-sm md:text-base",
] as const;

function SkillStream({
  items,
  reduce,
  durationSec,
}: {
  items: readonly SlideItem[];
  reduce: boolean;
  durationSec: number;
}) {
  const words = items
    .flatMap((item) => [
      { text: item.title, accent: true },
      ...item.detail
        .split("·")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((text) => ({ text, accent: false })),
    ])
    .slice(0, 22);

  return (
    <div className="relative mt-2 h-[42vh] w-full max-w-5xl md:h-[46vh]">
      {words.map((word, i) => {
        // Deterministic low-discrepancy scatter — no Math.random, no
        // hydration drift.
        const left = 6 + ((i * 0.618034) % 1) * 58;
        const top = 6 + ((i * 0.381966 + 0.17) % 1) * 84;
        const depth = i % 3;
        const drift = (i % 2 === 0 ? 1 : -1) * (28 - depth * 9);
        return (
          <DriftLayer
            key={`${word.text}-${i}`}
            driftX={drift}
            duration={durationSec}
            reduce={reduce}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <motion.span
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 1.25, filter: "blur(12px)" }
              }
              animate={
                reduce
                  ? {
                      opacity: DEPTH_OPACITY[depth],
                      transition: { duration: 0.5, delay: 0.2 },
                    }
                  : {
                      opacity: DEPTH_OPACITY[depth],
                      scale: 1,
                      filter: `blur(${DEPTH_BLUR[depth]}px)`,
                      transition: {
                        duration: 1,
                        delay: 0.55 + i * 0.07,
                        ease: EASE,
                      },
                    }
              }
              exit={exitUp(reduce, i * 0.6)}
              className={cn(
                "block whitespace-nowrap",
                word.accent
                  ? "text-[10px] uppercase tracking-[0.35em] text-(--color-accent)"
                  : DEPTH_SIZE[depth],
              )}
            >
              {word.text}
            </motion.span>
          </DriftLayer>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project sweep — names arrive large with momentum, impact follows.   */
/* ------------------------------------------------------------------ */

function ProjectSweep({
  items,
  reduce,
  durationSec,
}: {
  items: readonly SlideItem[];
  reduce: boolean;
  durationSec: number;
}) {
  return (
    <div className="mt-8 flex w-full max-w-4xl flex-col gap-7 text-left md:mt-12 md:gap-9">
      {items.map((item, i) => {
        const base = 0.55 + i * 0.5;
        return (
          <DriftLayer
            key={item.title}
            driftX={i % 2 === 0 ? 26 : -26}
            duration={durationSec}
            reduce={reduce}
          >
            {item.meta && (
              <motion.p
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, x: 46, filter: "blur(6px)" }
                }
                animate={
                  reduce
                    ? { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
                    : {
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.9, delay: base, ease: EASE },
                      }
                }
                exit={exitUp(reduce, i)}
                className="text-[10px] uppercase tracking-[0.3em] text-(--color-accent)"
              >
                {item.meta}
              </motion.p>
            )}
            <motion.h3
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: 90, filter: "blur(12px)" }
              }
              animate={
                reduce
                  ? { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
                  : {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 1.05,
                        delay: base + 0.08,
                        ease: EASE,
                      },
                    }
              }
              exit={exitUp(reduce, i + 0.5)}
              className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl"
            >
              {item.title}
            </motion.h3>
            <motion.p
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: 52, filter: "blur(8px)" }
              }
              animate={
                reduce
                  ? { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
                  : {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.95,
                        delay: base + 0.22,
                        ease: EASE,
                      },
                    }
              }
              exit={exitUp(reduce, i + 1)}
              className="mt-1.5 max-w-2xl text-sm leading-relaxed text-(--color-fg-muted) md:text-base"
            >
              {item.detail}
            </motion.p>
          </DriftLayer>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ChapterView — one continuous kinetic scene per chapter.             */
/* ------------------------------------------------------------------ */

export function ChapterView({
  slide,
  isFirst,
  reduce,
  durationSec,
}: {
  slide: Slide;
  /** The opening chapter carries the route's only h1. */
  isFirst: boolean;
  reduce: boolean;
  durationSec: number;
}) {
  const years = useExperienceYears();

  // The ghost numeral mirrors the kicker's own number ("01 — Who") rather
  // than the deck position — the hook slide is unnumbered by design.
  const numeral = slide.kicker.match(/^\s*(\d+)/)?.[1] ?? null;

  const isProjects = Boolean(slide.items?.some((it) => it.meta));
  const isSkills = Boolean(slide.items) && !isProjects;
  const hero = !slide.items;
  const sentences = slide.body ? slide.body.split(/(?<=[.!?])\s+/) : [];

  // The deck is date-agnostic; substitute the live experience word here so
  // statically prerendered HTML never bakes in a stale number.
  const heading = slide.heading.map((seg) =>
    seg.text.includes(YEARS_TOKEN)
      ? { ...seg, text: seg.text.replace(YEARS_TOKEN, numberWord(years)) }
      : seg,
  );

  const stats: readonly { value: number; label: string }[] = [
    { value: years, label: "years in production" },
    { value: featuredProjects.length, label: "flagship systems" },
    { value: SKILL_COUNT, label: "technologies in play" },
  ];

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-center px-6 md:px-10",
        isProjects ? "items-start md:items-center" : "items-center text-center",
      )}
    >
      {/* Ghost chapter numeral — deepest parallax layer */}
      {numeral && (
        <DriftLayer
          driftY={14}
          duration={durationSec}
          reduce={reduce}
          className="pointer-events-none absolute bottom-[2vh] right-[1vw] select-none"
        >
          <motion.span
            aria-hidden
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 70 }}
            animate={
              reduce
                ? { opacity: 1, transition: { duration: 0.6 } }
                : {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1.7, delay: 0.2, ease: EASE },
                  }
            }
            exit={exitUp(reduce, 2)}
            className="block font-display italic leading-none text-(--color-fg)/[0.05] text-[36vw] md:text-[22vw]"
          >
            {numeral}
          </motion.span>
        </DriftLayer>
      )}

      {/* Kicker — letter-tracking settles as it fades in */}
      <motion.p
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, letterSpacing: "0.62em", filter: "blur(6px)" }
        }
        animate={
          reduce
            ? { opacity: 1, transition: { duration: 0.5, delay: 0.1 } }
            : {
                opacity: 1,
                letterSpacing: "0.35em",
                filter: "blur(0px)",
                transition: { duration: 1.3, delay: 0.12, ease: EASE },
              }
        }
        exit={exitUp(reduce, 0)}
        className="mb-6 text-[11px] uppercase text-(--color-fg-muted)"
      >
        {slide.kicker}
      </motion.p>

      {/* Heading layer — its own drift velocity */}
      <DriftLayer driftY={22} duration={durationSec} reduce={reduce}>
        <KineticHeading
          segments={heading}
          reduce={reduce}
          as={isFirst ? "h1" : "h2"}
          baseDelay={0.32}
          className={cn(
            hero
              ? "max-w-5xl text-5xl leading-[1.04] md:text-7xl lg:text-8xl"
              : "max-w-4xl text-3xl leading-[1.06] md:text-5xl",
          )}
        />
      </DriftLayer>

      {/* Body — sentence lines slide on different velocities */}
      {sentences.length > 0 && (
        <div className="mt-8 max-w-2xl space-y-1.5">
          {sentences.map((line, i) => (
            <DriftLayer
              key={`${slide.id}-line-${i}`}
              driftY={36 + i * 13}
              duration={durationSec}
              reduce={reduce}
            >
              <motion.p
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 30, filter: "blur(10px)" }
                }
                animate={
                  reduce
                    ? { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
                    : {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: {
                          duration: 1,
                          delay: 0.78 + i * 0.18,
                          ease: EASE,
                        },
                      }
                }
                exit={exitUp(reduce, i + 1)}
                className="text-balance text-base leading-relaxed text-(--color-fg-muted) md:text-lg"
              >
                {line}
              </motion.p>
            </DriftLayer>
          ))}
        </div>
      )}

      {/* Count-up stats — the "who" chapter's proof row */}
      {slide.id === "who" && (
        <div className="mt-10 flex items-start justify-center gap-10 md:mt-14 md:gap-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 26, filter: "blur(8px)" }
              }
              animate={
                reduce
                  ? { opacity: 1, transition: { duration: 0.5, delay: 0.1 } }
                  : {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.9,
                        delay: 1.15 + i * 0.16,
                        ease: EASE,
                      },
                    }
              }
              exit={exitUp(reduce, i + 2)}
              className="text-center"
            >
              <p className="text-4xl font-semibold tracking-tight md:text-6xl">
                <CountUp
                  value={stat.value}
                  delay={1.25 + i * 0.16}
                  reduce={reduce}
                />
                <span className="text-(--color-accent)">+</span>
              </p>
              <p className="mt-2.5 text-[10px] uppercase tracking-[0.3em] text-(--color-fg-muted)">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {isSkills && slide.items && (
        <SkillStream
          items={slide.items}
          reduce={reduce}
          durationSec={durationSec}
        />
      )}

      {isProjects && slide.items && (
        <ProjectSweep
          items={slide.items}
          reduce={reduce}
          durationSec={durationSec}
        />
      )}

      {slide.isCta && (
        <>
          <motion.a
            href={`mailto:${bio.contact.email}`}
            data-cursor="hover"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 26, scale: 0.96, filter: "blur(8px)" }
            }
            animate={
              reduce
                ? { opacity: 1, transition: { duration: 0.5, delay: 0.3 } }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: { duration: 0.9, delay: 1.15, ease: EASE },
                  }
            }
            exit={exitUp(reduce, 2)}
            className="pointer-events-auto mt-10 inline-block rounded-full border border-(--color-accent)/70 bg-(--color-accent)/10 px-9 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-(--color-accent) transition-colors hover:bg-(--color-accent)/20"
          >
            {bio.contact.email}
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.8, delay: reduce ? 0.5 : 2 },
            }}
            exit={exitUp(reduce, 3)}
            className="mt-12"
          >
            <ScrollHint
              label="scroll for the handshake"
              tone="muted"
              reduce={reduce}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
