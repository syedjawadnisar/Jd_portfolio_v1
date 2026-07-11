"use client";

import { motion } from "framer-motion";
import type { StageAnswer, StageDef } from "./stages";

const easeOut = [0.22, 1, 0.36, 1] as const;

type StageCheckpointProps = {
  stage: StageDef;
  nextStage: StageDef;
  answer: StageAnswer;
  onNext: () => void;
};

/**
 * The quick beat between stages — one line, one button.
 * Momentum over ceremony; the full theatrics wait at the finale.
 */
export function StageCheckpoint({
  stage,
  nextStage,
  answer,
  onNext,
}: StageCheckpointProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        className="w-full max-w-xl rounded-2xl border border-[--color-border] bg-[--color-bg-elevated]/60 px-8 py-10 backdrop-blur-sm md:px-12"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-[--stage-accent]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Checkpoint — {stage.name} cleared
        </motion.p>

        <motion.p
          className="mt-6 text-balance font-display text-2xl italic leading-snug tracking-tight md:text-3xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: easeOut }}
        >
          {answer.checkpoint}
        </motion.p>

        <motion.p
          className="mt-6 text-[11px] uppercase tracking-[0.25em] text-[--color-fg-muted]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          Up next: {nextStage.name}
        </motion.p>

        <motion.button
          type="button"
          onClick={onNext}
          data-cursor="hover"
          className="mt-8 rounded-full border border-[--stage-accent] bg-[--stage-accent]/10 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[--stage-accent] transition-colors hover:bg-[--stage-accent]/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: easeOut }}
          whileTap={{ scale: 0.97 }}
        >
          Next stage →
        </motion.button>
      </motion.div>
    </div>
  );
}
