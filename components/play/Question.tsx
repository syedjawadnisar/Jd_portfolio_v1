"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { classifyFreeText, type StageChip, type StageDef } from "./stages";

const easeOut = [0.22, 1, 0.36, 1] as const;

type QuestionProps = {
  stage: StageDef;
  onAnswer: (chip: StageChip) => void;
};

export function Question({ stage, onAnswer }: QuestionProps) {
  const [text, setText] = useState("");

  const submitFreeText = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnswer(classifyFreeText(text, stage));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <motion.p
        className="mb-5 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        {stage.eyebrow}
      </motion.p>

      <motion.h1
        className="max-w-3xl text-balance font-display text-5xl italic leading-[1.05] tracking-tight md:text-7xl"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.85, ease: easeOut }}
      >
        {stage.question}
      </motion.h1>

      <div className="mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-3">
        {stage.chips.map((chip, i) => (
          <motion.button
            key={chip.label}
            type="button"
            data-cursor="hover"
            onClick={() => onAnswer(chip)}
            className="rounded-full border border-[--color-border] bg-[--color-bg-elevated]/60 px-5 py-2.5 text-sm text-[--color-fg] backdrop-blur-sm transition-colors duration-300 hover:border-[--stage-accent] hover:text-[--stage-accent]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07, duration: 0.55, ease: easeOut }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {chip.label}
          </motion.button>
        ))}
      </div>

      <motion.p
        className="mt-14 text-[11px] uppercase tracking-[0.25em] text-[--color-fg-muted]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        or tell me in your own words
      </motion.p>

      <motion.form
        onSubmit={submitFreeText}
        className="mt-5 flex w-full max-w-md items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
      >
        <label htmlFor="free-answer" className="sr-only">
          Or tell me in your own words
        </label>
        <input
          id="free-answer"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={stage.placeholder}
          data-cursor="hover"
          autoComplete="off"
          className="w-full border-b border-[--color-border] bg-transparent px-1 py-2.5 text-center text-sm text-[--color-fg] outline-none transition-colors placeholder:text-[--color-fg-muted]/60 focus:border-[--stage-accent]"
        />
        <button
          type="submit"
          data-cursor="hover"
          aria-label="Submit your answer"
          className="shrink-0 rounded-full border border-[--color-border] px-4 py-2 text-sm text-[--color-fg-muted] transition-colors hover:border-[--stage-accent] hover:text-[--stage-accent]"
        >
          →
        </button>
      </motion.form>
    </div>
  );
}
