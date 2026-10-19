"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { slides } from "@/data/slides";
import SilkBackgroundClient from "@/components/three/SilkBackgroundClient";
import { BackLink } from "@/components/ui/BackLink";
import { ChapterView } from "./ChapterView";

const LAST_INDEX = slides.length - 1;

/**
 * Pace guard only — the deck in data/slides.ts is paced deliberately
 * (~50s total, every chapter well under this cap), so the clamp normally
 * never fires. It exists to stop a future copy edit from letting one
 * chapter overstay.
 */
const MAX_CHAPTER_MS = 12000;

/** Frame deltas above this are a stall (background tab, long GC) — not time watched. */
const MAX_FRAME_DELTA_MS = 100;

const CHAPTER_MS: readonly number[] = slides.map((s) =>
  Math.min(s.durationMs, MAX_CHAPTER_MS),
);
const TOTAL_MS = CHAPTER_MS.reduce((sum, ms) => sum + ms, 0);
const CUM_MS: readonly number[] = CHAPTER_MS.reduce<number[]>(
  (acc, _, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + CHAPTER_MS[i - 1]);
    return acc;
  },
  [],
);

function formatRemaining(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CinematicExperience() {
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  // Seeded from document.hidden so a deck opened in a background tab never
  // starts its clock; otherwise the first visible frame swallows a chapter.
  const [docHidden, setDocHidden] = useState(
    () => typeof document !== "undefined" && document.hidden,
  );
  const [finished, setFinished] = useState(false);
  const [remainingSec, setRemainingSec] = useState(
    Math.ceil(TOTAL_MS / 1000),
  );

  // Elapsed ms inside the current chapter. Accumulated from frame deltas so
  // pause/resume and tab-hide never skew the math — wall clock is never read
  // across a gap.
  const elapsedRef = useRef(0);
  const segmentProgress = useMotionValue(0);

  const running = !userPaused && !docHidden && !finished;

  const syncRemaining = useCallback((i: number, elapsedMs: number) => {
    const remaining = TOTAL_MS - CUM_MS[i] - elapsedMs;
    const sec = Math.max(0, Math.ceil(remaining / 1000));
    setRemainingSec((prev) => (prev === sec ? prev : sec));
  }, []);

  /* ----------------------------------------------------------------
   * Autoplay engine — one rAF loop per (running, index) combination.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    if (!running) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - last, MAX_FRAME_DELTA_MS);
      last = now;

      const duration = CHAPTER_MS[index];
      const elapsed = Math.min(elapsedRef.current + delta, duration);
      elapsedRef.current = elapsed;
      segmentProgress.set(elapsed / duration);
      syncRemaining(index, elapsed);

      if (elapsed >= duration) {
        if (index === LAST_INDEX) {
          setFinished(true);
        } else {
          elapsedRef.current = 0;
          segmentProgress.set(0);
          setIndex(index + 1);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, index, segmentProgress, syncRemaining]);

  /* ----------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------- */
  const goTo = useCallback(
    (target: number) => {
      if (target > LAST_INDEX) {
        // Skipping forward past the CTA completes the run.
        elapsedRef.current = CHAPTER_MS[LAST_INDEX];
        segmentProgress.set(1);
        setFinished(true);
        syncRemaining(LAST_INDEX, CHAPTER_MS[LAST_INDEX]);
        return;
      }
      const next = Math.max(0, target);
      elapsedRef.current = 0;
      segmentProgress.set(0);
      setFinished(false);
      setIndex(next);
      syncRemaining(next, 0);
    },
    [segmentProgress, syncRemaining],
  );

  /* ----------------------------------------------------------------
   * Pause when the tab is hidden
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const onVisibility = () => setDocHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* ----------------------------------------------------------------
   * Lock page scroll until the CTA chapter — the footer waits below.
   * ---------------------------------------------------------------- */
  const onLastChapter = index === LAST_INDEX;
  useEffect(() => {
    if (onLastChapter) return;
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [onLastChapter]);

  /* ----------------------------------------------------------------
   * Keyboard — arrows skip, space toggles, esc exits.
   * Bound once; live state is read through refs so the deck does not
   * re-subscribe on every countdown tick.
   * ---------------------------------------------------------------- */
  const indexRef = useRef(index);
  indexRef.current = index;
  const finishedRef = useRef(finished);
  finishedRef.current = finished;
  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      // Once the deck is done the visitor has scrolled into the footer game.
      // Nothing below may hijack their arrows, space bar, or escape key.
      if (finishedRef.current) return;

      if (e.key === "ArrowRight") {
        goToRef.current(indexRef.current + 1);
      } else if (e.key === "ArrowLeft") {
        goToRef.current(indexRef.current - 1);
      } else if (e.key === "Escape") {
        router.push("/");
      } else if (e.key === " ") {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "BUTTON" || target.tagName === "A")) {
          return; // let the focused control handle it
        }
        e.preventDefault();
        setUserPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const slide = slides[index];

  return (
    <section
      aria-label="Cinematic overview"
      className="relative h-svh overflow-hidden"
    >
      {/* Living silk backdrop — the only WebGL on this route */}
      <SilkBackgroundClient variant="energetic" />

      {/* Vignette stack — keeps type crisp over the shader */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_62%_54%_at_50%_44%,color-mix(in_oklch,var(--color-bg)_45%,transparent),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_48%,color-mix(in_oklch,var(--color-bg)_78%,transparent)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-44 bg-[linear-gradient(to_top,color-mix(in_oklch,var(--color-bg)_80%,transparent),transparent)]"
      />

      {/* Exit affordances */}
      <BackLink className="fixed left-6 top-6 z-50" />
      <p
        aria-hidden
        className="fixed right-6 top-6 z-50 hidden text-[11px] uppercase tracking-[0.3em] text-(--color-fg-muted) md:block"
      >
        esc to exit
      </p>

      {/* Click zones — left half back, right half forward */}
      <button
        type="button"
        aria-label="Previous chapter"
        data-cursor="hover"
        onClick={() => goTo(index - 1)}
        className="absolute inset-y-0 left-0 z-10 w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-accent)"
      />
      <button
        type="button"
        aria-label="Next chapter"
        data-cursor="hover"
        onClick={() => goTo(index + 1)}
        className="absolute inset-y-0 right-0 z-10 w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-accent)"
      />

      {/* Chapter layer — pointer-events pass through to the click zones;
          interactive elements (CTA) opt back in. Chapters overlap during
          handoff: the outgoing one exits with momentum while the incoming
          one is already staging its words. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <AnimatePresence mode="sync">
          <motion.div key={slide.id} className="absolute inset-0">
            <ChapterView
              slide={slide}
              isFirst={index === 0}
              reduce={reduce}
              durationSec={CHAPTER_MS[index] / 1000}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control rail — quiet until hovered */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-6 pb-6 md:px-10 md:pb-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
          <div aria-hidden className="flex gap-1.5">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="h-[2px] flex-1 overflow-hidden rounded-full bg-(--color-fg)/10"
              >
                {i < index && (
                  <span className="block h-full w-full bg-(--color-accent)/80" />
                )}
                {i === index && (
                  <motion.span
                    className="block h-full w-full bg-(--color-accent)/80"
                    style={{ scaleX: segmentProgress, transformOrigin: "left" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-(--color-fg-muted)">
            {/* Once the run is over `running` can never return, so the
                pause switch becomes a replay. */}
            <button
              type="button"
              onClick={() => (finished ? goTo(0) : setUserPaused((p) => !p))}
              data-cursor="hover"
              aria-label={
                finished
                  ? "Replay from the first chapter"
                  : userPaused
                    ? "Resume autoplay"
                    : "Pause autoplay"
              }
              className="flex items-center gap-2.5 uppercase tracking-[0.28em] transition-colors hover:text-(--color-accent)"
            >
              <svg
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="currentColor"
                aria-hidden
              >
                {finished ? (
                  <path d="M6 1.5a4.5 4.5 0 1 0 4.24 3H8.9A3.2 3.2 0 1 1 6 2.8V4.6l2.6-1.9L6 .8z" />
                ) : userPaused ? (
                  <path d="M3 1.5l7.5 4.5L3 10.5z" />
                ) : (
                  <>
                    <rect x="2.4" y="1.5" width="2.6" height="9" rx="0.7" />
                    <rect x="7" y="1.5" width="2.6" height="9" rx="0.7" />
                  </>
                )}
              </svg>
              {finished ? "replay" : userPaused ? "play" : "pause"}
            </button>

            <p>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </p>

            <p className="tabular-nums">{formatRemaining(remainingSec)}</p>
          </div>
        </div>
      </div>

      {/* Screen-reader narration of chapter changes */}
      <p aria-live="polite" className="sr-only">
        Chapter {index + 1} of {slides.length}: {slide.kicker}
      </p>
    </section>
  );
}
