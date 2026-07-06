"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  slides,
  CUMULATIVE_MS,
  TOTAL_DURATION_MS,
} from "@/data/slides";
import { SlideView } from "./SlideView";

const easeOut = [0.22, 1, 0.36, 1] as const;
const LAST_INDEX = slides.length - 1;

function formatRemaining(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CinematicExperience() {
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [userPaused, setUserPaused] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [finished, setFinished] = useState(false);
  const [remainingSec, setRemainingSec] = useState(
    Math.ceil(TOTAL_DURATION_MS / 1000),
  );

  // Elapsed ms inside the current slide. Accumulated from frame deltas so
  // pause/resume and tab-hide never skew the math — wall clock is never read
  // across a gap.
  const elapsedRef = useRef(0);
  const segmentProgress = useMotionValue(0);

  const running = !userPaused && !docHidden && !finished;

  const syncRemaining = useCallback((i: number, elapsedMs: number) => {
    const remaining = TOTAL_DURATION_MS - CUMULATIVE_MS[i] - elapsedMs;
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
      const delta = now - last;
      last = now;

      const duration = slides[index].durationMs;
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
          setDirection(1);
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
  function goTo(target: number) {
    if (target > LAST_INDEX) {
      // Skipping forward past the CTA completes the deck.
      elapsedRef.current = slides[LAST_INDEX].durationMs;
      segmentProgress.set(1);
      setFinished(true);
      syncRemaining(LAST_INDEX, slides[LAST_INDEX].durationMs);
      return;
    }
    const next = Math.max(0, target);
    setDirection(next >= index ? 1 : -1);
    elapsedRef.current = 0;
    segmentProgress.set(0);
    setFinished(false);
    setIndex(next);
    syncRemaining(next, 0);
  }

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
   * Lock page scroll until the CTA slide — the footer waits below.
   * ---------------------------------------------------------------- */
  const onLastSlide = index === LAST_INDEX;
  useEffect(() => {
    if (onLastSlide) return;
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [onLastSlide]);

  /* ----------------------------------------------------------------
   * Keyboard — arrows skip, space toggles, esc exits.
   * Re-subscribed each render so handlers always see fresh state.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") {
        goTo(index + 1);
      } else if (e.key === "ArrowLeft") {
        goTo(index - 1);
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
  });

  /* ----------------------------------------------------------------
   * Slide transition variants — crossfade only under reduced motion.
   * ---------------------------------------------------------------- */
  const variants: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({
          opacity: 0,
          x: dir * 90,
          scale: 0.98,
          filter: "blur(14px)",
        }),
        center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
        exit: (dir: number) => ({
          opacity: 0,
          x: dir * -90,
          scale: 1.02,
          filter: "blur(14px)",
        }),
      };

  const slide = slides[index];

  return (
    <section
      aria-label="60-second cinematic overview"
      className="relative h-svh overflow-hidden"
    >
      {/* Backdrop — gradient + vignette, consistent with the landing scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.22_0.04_270/0.55),transparent_60%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,oklch(0.78_0.18_65/0.06),transparent_55%)]"
        animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0.1_0.02_270/0.7)_100%)]"
      />

      {/* Exit affordances */}
      <Link
        href="/"
        data-cursor="hover"
        className="fixed left-6 top-6 z-50 text-xs uppercase tracking-widest text-[--color-fg-muted] transition-colors hover:text-[--color-accent]"
      >
        ← back
      </Link>
      <p
        aria-hidden
        className="fixed right-6 top-6 z-50 hidden text-[10px] uppercase tracking-[0.3em] text-[--color-fg-muted]/60 md:block"
      >
        esc to exit
      </p>

      {/* Click zones — left half back, right half forward */}
      <button
        type="button"
        aria-label="Previous slide"
        data-cursor="hover"
        onClick={() => goTo(index - 1)}
        className="absolute inset-y-0 left-0 z-10 w-1/2 focus:outline-none"
      />
      <button
        type="button"
        aria-label="Next slide"
        data-cursor="hover"
        onClick={() => goTo(index + 1)}
        className="absolute inset-y-0 right-0 z-10 w-1/2 focus:outline-none"
      />

      {/* Slide layer — pointer-events pass through to the click zones;
          interactive slide elements opt back in. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.35 : 0.8, ease: easeOut }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SlideView slide={slide} reduce={reduce} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control rail — segmented progress, pause, counter, countdown */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-6 pb-6 md:px-10 md:pb-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
          <div aria-hidden className="flex gap-1.5">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-[--color-border]"
              >
                {i < index && (
                  <span className="block h-full w-full bg-[--color-accent]" />
                )}
                {i === index && (
                  <motion.span
                    className="block h-full w-full bg-[--color-accent]"
                    style={{ scaleX: segmentProgress, transformOrigin: "left" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[--color-fg-muted]">
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              data-cursor="hover"
              aria-label={userPaused ? "Resume autoplay" : "Pause autoplay"}
              className="flex items-center gap-2.5 uppercase tracking-[0.3em] transition-colors hover:text-[--color-accent]"
            >
              <svg
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="currentColor"
                aria-hidden
              >
                {userPaused ? (
                  <path d="M3 1.5l7.5 4.5L3 10.5z" />
                ) : (
                  <>
                    <rect x="2.4" y="1.5" width="2.6" height="9" rx="0.7" />
                    <rect x="7" y="1.5" width="2.6" height="9" rx="0.7" />
                  </>
                )}
              </svg>
              {userPaused ? "play" : "pause"}
            </button>

            <p>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </p>

            <p className="tabular-nums">{formatRemaining(remainingSec)}</p>
          </div>
        </div>
      </div>

      {/* Screen-reader narration of slide changes */}
      <p aria-live="polite" className="sr-only">
        Slide {index + 1} of {slides.length}: {slide.kicker}
      </p>
    </section>
  );
}
