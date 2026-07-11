"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { bio } from "@/data/bio";

const easeOut = [0.22, 1, 0.36, 1] as const;

// Design tokens via CSS vars — applied through style props, since SVG
// presentation attributes can't resolve var() but style-based paints can.
// The stage accent is set by PlayExperience, so the box wears the
// stage-3 palette at the finale.
const ACCENT = "var(--stage-accent, var(--color-accent))";
const ACCENT_SOFT = "var(--stage-accent-soft, var(--color-accent-soft))";
const SURFACE = "var(--color-bg-elevated)";
const MUTED = "var(--color-fg-muted)";

const SHAKE: Record<number, { x: number[]; rotate: number[] }> = {
  1: { x: [0, -4, 4, -3, 0], rotate: [0, -2, 2.5, -1.5, 0] },
  2: { x: [0, -7, 7, -5, 5, 0], rotate: [0, -4, 4.5, -3, 3, 0] },
};

function CatWithBox({
  clicks,
  opened,
  reduced,
  onBoxClick,
}: {
  clicks: number;
  opened: boolean;
  reduced: boolean;
  onBoxClick: () => void;
}) {
  const boxKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onBoxClick();
    }
  };

  const shake = !reduced && clicks > 0 && !opened ? SHAKE[clicks] : undefined;

  return (
    <svg
      viewBox="0 0 240 290"
      role="img"
      aria-label="A happy cat presenting a mystery box"
      className="w-[min(72vw,300px)]"
    >
      {/* Cat — gentle idle bounce; a single hop when the box opens */}
      <motion.g
        animate={
          opened
            ? reduced
              ? undefined
              : { y: [0, -14, 0] }
            : reduced
              ? undefined
              : { y: [0, -5, 0] }
        }
        transition={
          opened
            ? { duration: 0.6, ease: easeOut }
            : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Tail */}
        <motion.path
          d="M 168 156 Q 204 148 198 116"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          animate={reduced ? undefined : { rotate: [0, 9, 0, -5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ stroke: ACCENT, originX: 0, originY: 1 }}
        />

        {/* Ears (drawn first so the head covers their base) */}
        <path
          d="M 90 58 L 83 24 L 114 44 Z"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ fill: SURFACE, stroke: ACCENT }}
        />
        <path
          d="M 150 58 L 157 24 L 126 44 Z"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ fill: SURFACE, stroke: ACCENT }}
        />

        {/* Body + head */}
        <ellipse cx="120" cy="150" rx="50" ry="36" strokeWidth="3" style={{ fill: SURFACE, stroke: ACCENT }} />
        <circle cx="120" cy="82" r="38" strokeWidth="3" style={{ fill: SURFACE, stroke: ACCENT }} />

        {/* Eyes — blink at rest, happy arcs once the box is open */}
        {opened ? (
          <>
            <path
              d="M 99 80 Q 106 71 113 80"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{ stroke: ACCENT_SOFT }}
            />
            <path
              d="M 127 80 Q 134 71 141 80"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{ stroke: ACCENT_SOFT }}
            />
          </>
        ) : (
          <>
            <motion.ellipse
              cx="106"
              cy="79"
              rx="4.5"
              ry="6"
              animate={reduced ? undefined : { scaleY: [1, 1, 0.12, 1] }}
              transition={{ duration: 4, times: [0, 0.9, 0.94, 1], repeat: Infinity }}
              style={{ fill: ACCENT_SOFT, originX: 0.5, originY: 0.5 }}
            />
            <motion.ellipse
              cx="134"
              cy="79"
              rx="4.5"
              ry="6"
              animate={reduced ? undefined : { scaleY: [1, 1, 0.12, 1] }}
              transition={{ duration: 4, times: [0, 0.9, 0.94, 1], repeat: Infinity }}
              style={{ fill: ACCENT_SOFT, originX: 0.5, originY: 0.5 }}
            />
          </>
        )}

        {/* Nose + mouth */}
        <path d="M 116 91 L 124 91 L 120 96 Z" style={{ fill: ACCENT }} />
        <path
          d="M 112 101 Q 116 106 120 101 Q 124 106 128 101"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ stroke: ACCENT }}
        />

        {/* Whiskers */}
        <g strokeWidth="2" strokeLinecap="round" opacity="0.55" style={{ stroke: MUTED }}>
          <line x1="84" y1="86" x2="58" y2="82" />
          <line x1="84" y1="93" x2="58" y2="97" />
          <line x1="156" y1="86" x2="182" y2="82" />
          <line x1="156" y1="93" x2="182" y2="97" />
        </g>
      </motion.g>

      {/* Mystery box — three knocks to open. The focusable group stays
          mounted across knocks (keyboard focus survives); only the inner
          group remounts, via key={clicks}, to re-trigger the shake. */}
      <motion.g
        role="button"
        tabIndex={opened ? -1 : 0}
        aria-label={
          opened ? "Opened mystery box" : `Mystery box — ${3 - clicks} knocks to open`
        }
        data-cursor="hover"
        onClick={opened ? undefined : onBoxClick}
        onKeyDown={opened ? undefined : boxKeyDown}
        whileTap={opened ? undefined : { scale: 0.96 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
      <motion.g
        key={clicks}
        animate={shake ? { x: shake.x, rotate: shake.rotate } : undefined}
        transition={{ duration: 0.5 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {/* Body */}
        <motion.rect
          x="82"
          y="208"
          width="76"
          height="54"
          rx="8"
          strokeWidth="3"
          animate={opened && !reduced ? { scaleY: [1, 1.07, 1] } : undefined}
          transition={{ duration: 0.5 }}
          style={{ fill: SURFACE, stroke: ACCENT, originX: 0.5, originY: 1 }}
        />
        <rect x="114" y="208" width="12" height="54" opacity="0.85" style={{ fill: ACCENT }} />
        <text
          x="120"
          y="243"
          textAnchor="middle"
          fontSize="28"
          fontStyle="italic"
          style={{ fill: ACCENT_SOFT, fontFamily: "var(--font-display), Georgia, serif" }}
        >
          ?
        </text>

        {/* Cracks appear knock by knock */}
        {clicks >= 1 && !opened && (
          <motion.g
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ stroke: ACCENT_SOFT }}
          >
            <path d="M 98 208 l 6 13 l -5 11" />
            <path d="M 138 208 l -4 10" />
          </motion.g>
        )}
        {clicks >= 2 && !opened && (
          <motion.g
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ stroke: ACCENT_SOFT }}
          >
            <path d="M 144 208 l -7 15 l 6 11" />
            <path d="M 118 262 l 3 -13" />
          </motion.g>
        )}

        {/* Lid — flies off on the third knock */}
        <motion.g
          animate={
            opened
              ? reduced
                ? { opacity: 0 }
                : { y: -74, x: 30, rotate: 26, opacity: 0 }
              : undefined
          }
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <rect
            x="74"
            y="192"
            width="92"
            height="16"
            rx="6"
            strokeWidth="3"
            style={{ fill: SURFACE, stroke: ACCENT }}
          />
          <rect x="114" y="192" width="12" height="16" opacity="0.85" style={{ fill: ACCENT }} />
        </motion.g>
      </motion.g>
      </motion.g>

      {/* Paws resting on the lid */}
      <motion.g
        animate={opened && !reduced ? { y: -10 } : undefined}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        <ellipse cx="100" cy="194" rx="9" ry="7" strokeWidth="2.5" style={{ fill: SURFACE, stroke: ACCENT }} />
        <ellipse cx="140" cy="194" rx="9" ry="7" strokeWidth="2.5" style={{ fill: SURFACE, stroke: ACCENT }} />
      </motion.g>

      {/* Radial burst on open */}
      {opened && !reduced && (
        <motion.g
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={120 + Math.cos(a) * 26}
                y1={210 + Math.sin(a) * 26}
                x2={120 + Math.cos(a) * 48}
                y2={210 + Math.sin(a) * 48}
                strokeWidth={i % 2 === 0 ? 3 : 2}
                strokeLinecap="round"
                style={{ stroke: i % 2 === 0 ? ACCENT : ACCENT_SOFT }}
              />
            );
          })}
        </motion.g>
      )}
    </svg>
  );
}

type RewardSceneProps = {
  /** The synthesized qualified-brief statement built from all three answers. */
  message: string;
  onPlayAgain: () => void;
};

export function RewardScene({ message, onPlayAgain }: RewardSceneProps) {
  const [clicks, setClicks] = useState(0);
  const opened = clicks >= 3;
  const reduced = useReducedMotion() ?? false;

  const hint =
    clicks === 0
      ? "The box takes three good knocks."
      : clicks === 1
        ? "Again."
        : "One more.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <motion.p
        className="mb-8 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        Three stages down — the reward
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.8, ease: easeOut }}
      >
        <CatWithBox
          clicks={clicks}
          opened={opened}
          reduced={reduced}
          onBoxClick={() => setClicks((c) => Math.min(c + 1, 3))}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key={`hint-${clicks}`}
            className="mt-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-sm text-[--color-fg-muted]">{hint}</p>
            <div className="flex gap-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={
                    i < clicks
                      ? "h-1.5 w-1.5 rounded-full bg-[--stage-accent]"
                      : "h-1.5 w-1.5 rounded-full bg-[--color-border]"
                  }
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="mt-10 flex max-w-2xl flex-col items-center"
            initial={{ opacity: 0, y: reduced ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.35, duration: 0.8, ease: easeOut }}
          >
            <p className="text-balance font-display text-3xl italic leading-snug tracking-tight md:text-5xl">
              {message}
            </p>

            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-[--color-fg-muted]">
              The real reward is one conversation away
            </p>
            <a
              href={`mailto:${bio.contact.email}`}
              data-cursor="hover"
              className="mt-4 rounded-full border border-[--stage-accent] bg-[--stage-accent]/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[--stage-accent] transition-colors hover:bg-[--stage-accent]/20"
            >
              Talk to Jawad
            </a>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                data-cursor="hover"
                className="rounded-full border border-[--color-border] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[--color-fg-muted] transition-colors hover:border-[--stage-accent] hover:text-[--stage-accent]"
              >
                Go to home
              </Link>
              <button
                type="button"
                onClick={onPlayAgain}
                data-cursor="hover"
                className="rounded-full border border-[--color-border] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-[--color-fg-muted] transition-colors hover:border-[--stage-accent] hover:text-[--stage-accent]"
              >
                Play again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
