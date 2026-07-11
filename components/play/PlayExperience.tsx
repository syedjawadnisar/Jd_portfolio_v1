"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { bio } from "@/data/bio";
import { cn } from "@/lib/utils";
import { Question } from "./Question";
import { Platformer } from "./Platformer";
import { StageCheckpoint } from "./StageCheckpoint";
import { RewardScene } from "./RewardScene";
import {
  buildFinale,
  stages,
  toAnswer,
  type StageAnswer,
  type StageChip,
} from "./stages";

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * The journey is finite by construction: question → run for each of the
 * three stages, a quick checkpoint after stages 1–2, the full reward after
 * stage 3. The only way back onto the course is "Play again" (full reset).
 */
type Step = "question" | "run" | "checkpoint" | "finale";

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

function StageIndicator({ stageIndex, name }: { stageIndex: number; name: string }) {
  return (
    <div className="fixed right-6 top-6 z-50 flex items-center gap-3">
      <p className="hidden text-xs uppercase tracking-widest text-[--color-fg-muted] sm:block">
        stage {stageIndex + 1} of 3 — {name}
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {stages.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              "h-1 w-5 rounded-full transition-colors duration-500",
              i < stageIndex && "bg-[--stage-accent]/45",
              i === stageIndex && "bg-[--stage-accent]",
              i > stageIndex && "bg-[--color-border]",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function PlayExperience() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [step, setStep] = useState<Step>("question");
  const [answers, setAnswers] = useState<StageAnswer[]>([]);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  if (webgl === null) return <main className="min-h-screen" />;
  if (!webgl) return <WebGLFallback />;

  const stage = stages[stageIndex];
  const lastStage = stageIndex === stages.length - 1;

  const handleAnswer = (chip: StageChip) => {
    setAnswers((prev) => [...prev.slice(0, stageIndex), toAnswer(stage, chip)]);
    setStep("run");
  };

  const handleCourseCleared = () => {
    setStep(lastStage ? "finale" : "checkpoint");
  };

  const handleNextStage = () => {
    setStageIndex((i) => Math.min(i + 1, stages.length - 1));
    setStep("question");
  };

  const handlePlayAgain = () => {
    setAnswers([]);
    setStageIndex(0);
    setStep("question");
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={
        {
          "--stage-accent": stage.theme.accent,
          "--stage-accent-soft": stage.theme.accentSoft,
        } as CSSProperties
      }
    >
      {/* Per-stage backdrop glows, crossfaded as the palette shifts */}
      {stages.map((s, i) => (
        <motion.div
          key={s.id}
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${s.theme.bgGlow}, transparent 60%)`,
          }}
          initial={false}
          animate={{ opacity: i === stageIndex ? 1 : 0 }}
          transition={{ duration: 1.1, ease: easeOut }}
        />
      ))}

      <Link
        href="/"
        data-cursor="hover"
        className="fixed left-6 top-6 z-50 text-xs uppercase tracking-widest text-[--color-fg-muted] transition-colors hover:text-[--stage-accent]"
      >
        ← back
      </Link>

      <StageIndicator stageIndex={stageIndex} name={stage.name} />

      <AnimatePresence mode="wait">
        {step === "question" && (
          <motion.div
            key={`question-${stage.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <Question stage={stage} onAnswer={handleAnswer} />
          </motion.div>
        )}

        {step === "run" && (
          <motion.div
            key={`run-${stage.id}`}
            className="relative h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Platformer stage={stage} onFinish={handleCourseCleared} />
          </motion.div>
        )}

        {step === "checkpoint" && answers[stageIndex] && !lastStage && (
          <motion.div
            key={`checkpoint-${stage.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <StageCheckpoint
              stage={stage}
              nextStage={stages[stageIndex + 1]}
              answer={answers[stageIndex]}
              onNext={handleNextStage}
            />
          </motion.div>
        )}

        {step === "finale" && answers.length === stages.length && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <RewardScene
              message={buildFinale(answers)}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
