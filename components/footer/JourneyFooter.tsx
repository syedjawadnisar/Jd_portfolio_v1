"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { bio } from "@/data/bio";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Game data                                                           */
/* ------------------------------------------------------------------ */

type GlyphId = "braces" | "terminal" | "node" | "bolt";

type Card = { id: number; glyph: GlyphId };

const GLYPH_ORDER: readonly GlyphId[] = ["braces", "terminal", "node", "bolt"];

const GLYPH_NAMES: Record<GlyphId, string> = {
  braces: "braces",
  terminal: "terminal prompt",
  node: "network node",
  bolt: "bolt",
};

// Each matched pair unlocks one contact channel, in this rail order.
const FRAGMENTS: Record<
  GlyphId,
  { label: string; href: string; external: boolean }
> = {
  braces: {
    label: bio.contact.email,
    href: `mailto:${bio.contact.email}`,
    external: false,
  },
  terminal: { label: "LinkedIn", href: bio.contact.linkedin, external: true },
  node: { label: "GitHub", href: bio.contact.github, external: true },
  bolt: {
    label: "Book a call",
    href: `mailto:${bio.contact.email}?subject=${encodeURIComponent(
      "Booking a call with Jawad",
    )}`,
    external: false,
  },
};

function buildDeck(): Card[] {
  const deck: Card[] = GLYPH_ORDER.flatMap((glyph, i) => [
    { id: i * 2, glyph },
    { id: i * 2 + 1, glyph },
  ]);
  // Fisher–Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/* ------------------------------------------------------------------ */
/* Heading                                                             */
/* ------------------------------------------------------------------ */

const HEADING_WORDS =
  "This is the end of the page, but the start of a journey together to success.".split(
    " ",
  );

// Italic display-serif accents: "end" + "a journey together to success."
const SERIF_INDICES = new Set([3, 11, 12, 13, 14, 15]);

/* ------------------------------------------------------------------ */
/* Inline SVG glyphs — minimal geometric, currentColor strokes         */
/* ------------------------------------------------------------------ */

function Glyph({ glyph, className }: { glyph: GlyphId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {glyph === "braces" && (
        <>
          <path d="M9.2 4.5c-1.9 0-2.8 1-2.8 2.9v2.2c0 1.4-.7 2.3-2.1 2.9 1.4.6 2.1 1.5 2.1 2.9v2.2c0 1.9.9 2.9 2.8 2.9" />
          <path d="M14.8 4.5c1.9 0 2.8 1 2.8 2.9v2.2c0 1.4.7 2.3 2.1 2.9-1.4.6-2.1 1.5-2.1 2.9v2.2c0 1.9-.9 2.9-2.8 2.9" />
        </>
      )}
      {glyph === "terminal" && (
        <>
          <path d="M4.5 5.5l6.3 6.5-6.3 6.5" />
          <path d="M13.5 18.5H20" />
        </>
      )}
      {glyph === "node" && (
        <>
          <circle cx="12" cy="12" r="2.4" />
          <circle cx="5.2" cy="5.6" r="1.6" />
          <circle cx="19.4" cy="8.1" r="1.6" />
          <circle cx="14.1" cy="19.9" r="1.6" />
          <path d="M10.3 10.3L6.4 6.7" />
          <path d="M14.2 11.2l3.7-2.4" />
          <path d="M12.6 14.3l1.1 4" />
        </>
      )}
      {glyph === "bolt" && (
        <path d="M13.3 3.4L5.9 13.5h5l-1.5 7.1 7.9-10.5h-5.2l1.2-6.7z" />
      )}
    </svg>
  );
}

function BackMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden
    >
      <rect x="8.5" y="8.5" width="7" height="7" transform="rotate(45 12 12)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function JourneyFooter() {
  const reduce = useReducedMotion();

  // Deck is shuffled client-side only — pre-mount we render identical
  // face-down placeholders, so SSR markup and first client render match.
  const [deck, setDeck] = useState<Card[] | null>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<GlyphId[]>([]);
  const [skipped, setSkipped] = useState(false);
  const mismatchTimer = useRef<number | null>(null);
  // Skipping unmounts the focused skip button; hand focus to the mail link
  // that replaces it, on mount (AnimatePresence delays that by one exit).
  const focusMailOnMount = useRef(false);

  useEffect(() => {
    setDeck(buildDeck());
    return () => {
      if (mismatchTimer.current !== null) {
        window.clearTimeout(mismatchTimer.current);
      }
    };
  }, []);

  const revealed: readonly GlyphId[] = skipped ? GLYPH_ORDER : matched;
  const complete = revealed.length === GLYPH_ORDER.length;

  function flipCard(index: number) {
    if (!deck || complete) return;
    const glyph = deck[index].glyph;
    if (
      matched.includes(glyph) ||
      flipped.includes(index) ||
      flipped.length >= 2
    ) {
      return;
    }
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;

    const [a, b] = next;
    if (deck[a].glyph === deck[b].glyph) {
      setMatched((m) => [...m, deck[a].glyph]);
      setFlipped([]);
    } else {
      mismatchTimer.current = window.setTimeout(() => {
        setFlipped([]);
        mismatchTimer.current = null;
      }, 800);
    }
  }

  const cells: readonly (Card | null)[] = deck ?? Array(8).fill(null);
  const lastUnlocked = matched.length > 0 ? matched[matched.length - 1] : null;

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24"
    >
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        {/* Heading */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE_OUT }}
          className="mb-4 text-xs uppercase tracking-[0.3em] text-[--color-fg-muted]"
        >
          Your move
        </motion.p>

        <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl">
          {HEADING_WORDS.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={
                reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }
              }
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: reduce ? 0 : 0.7,
                delay: reduce ? 0 : i * 0.05,
                ease: EASE_OUT,
              }}
              className={cn(
                "mr-[0.22em] inline-block",
                SERIF_INDICES.has(i) &&
                  "font-display italic font-normal text-[--color-accent-soft]",
              )}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            delay: reduce ? 0 : 0.5,
            ease: EASE_OUT,
          }}
          className="mx-auto mt-6 max-w-xl text-balance text-base text-[--color-fg-muted] md:text-lg"
        >
          Four pairs hide four ways to reach me. Match them — or skip straight
          to the handshake.
        </motion.p>

        {/* Card grid */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduce ? 0 : 0.7,
            delay: reduce ? 0 : 0.3,
            ease: EASE_OUT,
          }}
          className="mt-14 w-full max-w-[26rem] md:max-w-[30rem]"
        >
          <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[--color-fg-muted]">
            <span>Match a pair — unlock a channel</span>
            <span>{revealed.length} / 4</span>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {cells.map((card, i) => {
              const isUp =
                card !== null &&
                (complete ||
                  matched.includes(card.glyph) ||
                  flipped.includes(i));
              const isMatched =
                card !== null && (complete || matched.includes(card.glyph));
              // Every branch flipCard() bails on — mirrored so assistive tech
              // is told the card is inert instead of silently doing nothing.
              const isLocked =
                card === null || complete || isUp || flipped.length >= 2;

              return (
                <button
                  key={card ? card.id : `placeholder-${i}`}
                  type="button"
                  data-cursor="hover"
                  onClick={() => flipCard(i)}
                  aria-disabled={isLocked || undefined}
                  aria-label={
                    isUp && card
                      ? `Card ${i + 1} of 8, face up: ${GLYPH_NAMES[card.glyph]}`
                      : `Card ${i + 1} of 8, face down — flip it`
                  }
                  className="group relative aspect-[3/4] w-full select-none rounded-xl [perspective:900px]"
                >
                  <motion.span
                    className="absolute inset-0 block [transform-style:preserve-3d]"
                    animate={{ rotateY: isUp ? 180 : 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.55, ease: EASE_OUT }
                    }
                  >
                    {/* Back */}
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center rounded-xl border border-[--color-border] bg-[--color-bg-elevated]/60 backdrop-blur-sm transition-colors duration-300 [backface-visibility:hidden]",
                        !isUp && "group-hover:border-[--color-accent]/60",
                      )}
                    >
                      <BackMark className="h-4 w-4 text-[--color-fg-muted]/60" />
                    </span>

                    {/* Face */}
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center rounded-xl border bg-[--color-bg-elevated] [backface-visibility:hidden] [transform:rotateY(180deg)]",
                        isMatched
                          ? "border-[--color-accent]/70 text-[--color-accent]"
                          : "border-[--color-border] text-[--color-fg]",
                      )}
                    >
                      {card && (
                        <Glyph
                          glyph={card.glyph}
                          className="h-8 w-8 md:h-9 md:w-9"
                        />
                      )}
                    </span>
                  </motion.span>
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="sr-only">
            {skipped
              ? "Game skipped. All four contact channels unlocked."
              : `${revealed.length} of 4 pairs matched.${
                  lastUnlocked
                    ? ` ${FRAGMENTS[lastUnlocked].label} unlocked.`
                    : ""
                }`}
          </p>
        </motion.div>

        {/* Reveal rail → full contact block */}
        <div className="mt-12 w-full">
          <AnimatePresence mode="wait" initial={false}>
            {complete ? (
              <motion.div
                key="contact"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.2 : 0.7,
                  ease: EASE_OUT,
                }}
                className="flex flex-col items-center"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[--color-accent]">
                  {skipped
                    ? "No games — straight to it"
                    : "Four for four — sharp eyes"}
                </p>

                <p className="mx-auto mt-4 max-w-xl text-balance text-base text-[--color-fg-muted] md:text-lg">
                  Tell me what you&apos;re trying to build. I&apos;ll tell you
                  whether I&apos;m the one to ship it.
                </p>

                <a
                  href={`mailto:${bio.contact.email}`}
                  ref={(node) => {
                    if (node && focusMailOnMount.current) {
                      focusMailOnMount.current = false;
                      node.focus();
                    }
                  }}
                  data-cursor="hover"
                  className="mt-8 rounded-full border border-[--color-accent] bg-[--color-accent]/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[--color-accent] transition-colors hover:bg-[--color-accent]/20"
                >
                  {bio.contact.email}
                </a>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={bio.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="rounded-full border border-[--color-border] px-5 py-2 text-sm text-[--color-fg-muted] transition-colors hover:border-[--color-accent] hover:text-[--color-accent]"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={bio.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="rounded-full border border-[--color-border] px-5 py-2 text-sm text-[--color-fg-muted] transition-colors hover:border-[--color-accent] hover:text-[--color-accent]"
                  >
                    GitHub
                  </a>
                  <a
                    href={FRAGMENTS.bolt.href}
                    data-cursor="hover"
                    className="rounded-full border border-[--color-border] px-5 py-2 text-sm text-[--color-fg-muted] transition-colors hover:border-[--color-accent] hover:text-[--color-accent]"
                  >
                    Book a call
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="rail"
                exit={
                  reduce
                    ? { opacity: 0, transition: { duration: 0.15 } }
                    : {
                        opacity: 0,
                        y: -12,
                        transition: { duration: 0.3, ease: EASE_OUT },
                      }
                }
                className="flex flex-col items-center"
              >
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {GLYPH_ORDER.map((glyph) => {
                    const fragment = FRAGMENTS[glyph];
                    return revealed.includes(glyph) ? (
                      <motion.a
                        key={glyph}
                        href={fragment.href}
                        {...(fragment.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        data-cursor="hover"
                        initial={
                          reduce ? { opacity: 0 } : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduce ? 0.2 : 0.5,
                          ease: EASE_OUT,
                        }}
                        className="rounded-full border border-[--color-accent]/60 bg-[--color-accent]/10 px-5 py-2 text-sm text-[--color-accent] transition-colors hover:bg-[--color-accent]/20"
                      >
                        {fragment.label}
                      </motion.a>
                    ) : (
                      <span
                        key={glyph}
                        aria-hidden
                        className="select-none rounded-full border border-dashed border-[--color-border] px-5 py-2 text-sm text-[--color-fg-muted]/50"
                      >
                        · · ·
                      </span>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    focusMailOnMount.current = true;
                    setSkipped(true);
                  }}
                  data-cursor="hover"
                  className="mt-8 text-xs uppercase tracking-[0.2em] text-[--color-fg-muted] underline decoration-[--color-border] underline-offset-4 transition-colors hover:text-[--color-accent] hover:decoration-[--color-accent]"
                >
                  skip the game — just show me the contact
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
