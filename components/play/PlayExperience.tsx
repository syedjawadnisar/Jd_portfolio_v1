"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { bio } from "@/data/bio";
import { Question } from "./Question";
import { Platformer } from "./Platformer";
import { RewardScene } from "./RewardScene";
import { rounds, type Answer } from "./questions";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Step = "question" | "platformer" | "reward";

const STEP_LABELS: Record<Step, string> = {
  question: "01 — the question",
  platformer: "02 — the run",
  reward: "03 — the reward",
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function WebGLFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/60 p-8 text-center backdrop-blur-sm md:p-10">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]">
          Path C — The Interactive Journey
        </p>
        <h1 className="text-balance font-display text-3xl italic tracking-tight md:text-4xl">
          Your browser sat this game out.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[--color-fg-muted]">
          The platformer needs WebGL, and it didn&apos;t answer the call. No
          matter — the reward was always a conversation.
        </p>
        <a
          href={`mailto:${bio.contact.email}`}
          data-cursor="hover"
          className="mt-8 inline-block rounded-full border border-[--color-accent] bg-[--color-accent]/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[--color-accent] transition-colors hover:bg-[--color-accent]/20"
        >
          {bio.contact.email}
        </a>
        <div className="mt-6">
          <Link
            href="/"
            data-cursor="hover"
            className="text-xs uppercase tracking-widest text-[--color-fg-muted] transition-colors hover:text-[--color-accent]"
          >
            ← back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export function PlayExperience() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>("question");
  const [round, setRound] = useState(1);
  const [answer, setAnswer] = useState<Answer | null>(null);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  if (webgl === null) return <main className="min-h-screen" />;
  if (!webgl) return <WebGLFallback />;

  // Round 3+ replays the round-2 question; the obstacle layout still remixes.
  const roundIndex = Math.min(round, rounds.length) - 1;
  const roundDef = rounds[roundIndex];

  const startNextRound = () => {
    setAnswer(null);
    setRound((r) => r + 1);
    setStep("question");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,oklch(0.22_0.04_270/0.55),transparent_60%)]"
      />

      <Link
        href="/"
        data-cursor="hover"
        className="fixed left-6 top-6 z-50 text-xs uppercase tracking-widest text-[--color-fg-muted] transition-colors hover:text-[--color-accent]"
      >
        ← back
      </Link>

      <p className="fixed right-6 top-6 z-50 hidden text-xs uppercase tracking-widest text-[--color-fg-muted] sm:block">
        round {String(round).padStart(2, "0")} · {STEP_LABELS[step]}
      </p>

      <AnimatePresence mode="wait">
        {step === "question" && (
          <motion.div
            key={`question-${round}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <Question
              round={roundDef}
              roundIndex={roundIndex}
              eyebrow={
                round === 1
                  ? "Path C — The Interactive Journey"
                  : round <= rounds.length
                    ? `Round ${round} — new question, new course`
                    : `Round ${round} — one more run`
              }
              onAnswer={(a) => {
                setAnswer(a);
                setStep("platformer");
              }}
            />
          </motion.div>
        )}

        {step === "platformer" && (
          <motion.div
            key={`platformer-${round}`}
            className="relative h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Platformer
              layoutIndex={(round - 1) % 2}
              onFinish={() => setStep("reward")}
            />
          </motion.div>
        )}

        {step === "reward" && answer && (
          <motion.div
            key={`reward-${round}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <RewardScene
              answer={answer}
              round={round}
              onNextRound={startNextRound}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
