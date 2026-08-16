"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SESSION_KEY = "jn-intro-seen";

// Content hold before the curtain lifts. Letter stagger resolves by ~1.25s,
// the progress line by ~1.4s — the lift lands inside the 1.6s budget.
const HOLD_MS = 1450;
const HOLD_REDUCED_MS = 650;

const WORDS = [
  { text: "Jawad", serif: false },
  { text: "Nisar", serif: true },
] as const;

type Phase = "boot" | "play" | "done";

export function IntroOverlay() {
  // "boot" renders the opaque backdrop deterministically on SSR + first client
  // paint; the sessionStorage decision happens post-mount to avoid hydration
  // mismatch. `skip` bypasses AnimatePresence entirely so repeat visitors get
  // no exit animation — just nothing.
  const [phase, setPhase] = useState<Phase>("boot");
  const [skip, setSkip] = useState(false);
  const reduced = useReducedMotion();

  const dismiss = useCallback(() => setPhase("done"), []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Storage unavailable (private mode / blocked) — play the intro.
    }
    if (seen) {
      setSkip(true);
      return;
    }
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Non-fatal: the intro will simply replay on the next visit.
    }
    setPhase("play");
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    const timer = window.setTimeout(
      dismiss,
      reduced ? HOLD_REDUCED_MS : HOLD_MS,
    );
    window.addEventListener("pointerdown", dismiss);
    window.addEventListener("keydown", dismiss);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [phase, reduced, dismiss]);

  if (skip) return null;

  const playing = phase === "play";
  let letter = 0;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          aria-hidden
          initial={false}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.3 } }
              : {
                  y: "-100%",
                  pointerEvents: "none",
                  transition: { duration: 0.7, ease: EASE_OUT },
                }
          }
          className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[--color-bg]",
            // "boot" is the prerendered / pre-hydration state. The CSS
            // keyframe lifts the curtain on its own if React never takes
            // over; React drops the class on mount so it cannot fight the
            // framer-motion exit.
            phase === "boot" && "intro-curtain-fallback",
          )}
        >
          <noscript>
            <style>{`.intro-curtain-fallback { display: none; }`}</style>
          </noscript>

          <p className="text-5xl font-semibold tracking-tight text-[--color-fg] md:text-7xl">
            {WORDS.map((word, w) => (
              <span
                key={word.text}
                className={cn(
                  "inline-block whitespace-nowrap",
                  w > 0 && "ml-[0.28em]",
                  word.serif &&
                    "font-display italic font-normal text-[--color-accent-soft]",
                )}
              >
                {word.text.split("").map((ch, i) => {
                  const delay = 0.08 + letter++ * 0.05;
                  return (
                    <motion.span
                      key={`${ch}-${i}`}
                      className="inline-block"
                      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
                      animate={
                        playing
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : undefined
                      }
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.7, delay, ease: EASE_OUT }
                      }
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </p>

          <span className="relative mt-10 block h-px w-56 overflow-hidden bg-[--color-border] md:w-72">
            <motion.span
              className="absolute inset-0 origin-left bg-[--color-accent]"
              initial={{ scaleX: 0 }}
              animate={playing ? { scaleX: 1 } : undefined}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.3, delay: 0.12, ease: EASE_OUT }
              }
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
