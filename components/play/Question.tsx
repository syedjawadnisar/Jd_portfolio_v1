"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { classifyFreeText, type StageChip, type StageDef } from "./stages";

type QuestionProps = {
  stage: StageDef;
  onAnswer: (chip: StageChip) => void;
};

export function Question({ stage, onAnswer }: QuestionProps) {
  const [text, setText] = useState("");
  const reduce = useReducedMotion();

  /** Reduced motion keeps the fades, drops the travel and the stagger. */
  const rise = (y: number, delay: number, duration: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: reduce ? 0 : delay,
      duration: reduce ? 0.3 : duration,
      ease: EASE_OUT,
    },
  });

  const submitFreeText = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnswer(classifyFreeText(text, stage));
  };

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center">
      <motion.p
        className="mb-5 text-xs uppercase tracking-[0.3em] text-(--color-fg-muted)"
        {...rise(16, 0, 0.6)}
      >
        {stage.eyebrow}
      </motion.p>

      <motion.h1
        className="max-w-3xl text-balance font-display text-5xl italic leading-[1.05] tracking-tight md:text-7xl"
        {...rise(28, 0.1, 0.85)}
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
            // The pill is 40px tall (14px text + 2 x 10px padding) and this is
            // the primary control of the whole game — often the first thing a
            // thumb reaches for. Growing the padding would inflate the pill and
            // rewrap the row, so the hit area grows through a pseudo-element
            // instead, the same trick BackLink uses: +4px on each edge takes
            // the target to 48px while the pill keeps its drawn size. The row
            // gap is 12px in both axes, so a neighbour's expanded target still
            // clears this one by 4px and no tap can land on the wrong chip.
            className="relative px-5 py-2.5 text-sm text-(--color-fg) after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] rounded-full border border-(--color-border) bg-(--color-bg-elevated)/60 backdrop-blur-sm transition-colors duration-300 hover:border-(--stage-accent) hover:text-(--stage-accent)"
            {...rise(16, 0.35 + i * 0.07, 0.55)}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {chip.label}
          </motion.button>
        ))}
      </div>

      <motion.p
        className="mt-14 text-[11px] uppercase tracking-[0.25em] text-(--color-fg-muted)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 0.8, duration: reduce ? 0.3 : 0.7 }}
      >
        or tell me in your own words
      </motion.p>

      <motion.form
        onSubmit={submitFreeText}
        className="mt-5 flex w-full max-w-md items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: reduce ? 0 : 0.9,
          duration: reduce ? 0.3 : 0.7,
          ease: EASE_OUT,
        }}
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
          className="w-full border-b border-(--color-border) bg-transparent px-1 py-2.5 text-center text-sm text-(--color-fg) outline-none transition-colors placeholder:text-(--color-fg-muted) focus:border-(--stage-accent)"
        />
        <button
          type="submit"
          data-cursor="hover"
          aria-label="Submit your answer"
          // 36px tall as drawn, and it sits in a 12px-gap flex row next to the
          // text field — padding would push the field narrower and lift the
          // arrow off the input's baseline. Same pseudo-element hit area as the
          // chips, +6px per edge for a 48px target; the drawn width (32px of
          // padding around the glyph) already clears 44px. The expansion is
          // vertical only, so the input beside it keeps its own target intact.
          className="relative shrink-0 px-4 py-2 text-sm text-(--color-fg-muted) after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] rounded-full border border-(--color-border) transition-colors hover:border-(--stage-accent) hover:text-(--stage-accent)"
        >
          →
        </button>
      </motion.form>
    </div>
  );
}
