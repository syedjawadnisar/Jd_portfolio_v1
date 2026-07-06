"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { bio } from "@/data/bio";
import type { Slide } from "@/data/slides";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  reduce: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
};

/** Staggered inner reveal — crossfade-only under reduced motion. */
function Reveal({ reduce, delay, className, children }: RevealProps) {
  return (
    <motion.div
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(8px)" }
      }
      animate={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{
        duration: reduce ? 0.4 : 0.8,
        delay: reduce ? 0 : delay,
        ease: easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideView({ slide, reduce }: { slide: Slide; reduce: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
      <Reveal reduce={reduce} delay={0.15}>
        <p className="mb-6 text-[11px] uppercase tracking-[0.35em] text-[--color-fg-muted]">
          {slide.kicker}
        </p>
      </Reveal>

      <Reveal reduce={reduce} delay={0.25}>
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          {slide.heading.map((segment, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span
                className={cn(
                  segment.serif &&
                    "font-display italic font-normal text-[--color-accent-soft]",
                )}
              >
                {segment.text}
              </span>
            </Fragment>
          ))}
        </h2>
      </Reveal>

      {slide.body && (
        <Reveal reduce={reduce} delay={0.45} className="mt-8 max-w-2xl">
          <p className="text-balance text-base leading-relaxed text-[--color-fg-muted] md:text-lg">
            {slide.body}
          </p>
        </Reveal>
      )}

      {slide.items && (
        <div
          className={cn(
            "mt-10 grid w-full gap-x-10 text-left",
            slide.items.some((it) => it.meta)
              ? "max-w-2xl grid-cols-1 divide-y divide-[--color-border]"
              : "max-w-3xl grid-cols-1 gap-y-6 sm:grid-cols-2",
          )}
        >
          {slide.items.map((item, i) =>
            item.meta ? (
              <Reveal
                key={item.title}
                reduce={reduce}
                delay={0.45 + i * 0.1}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[--color-fg-muted]">
                    {item.meta}
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[--color-fg-muted] md:text-base">
                  {item.detail}
                </p>
              </Reveal>
            ) : (
              <Reveal key={item.title} reduce={reduce} delay={0.45 + i * 0.1}>
                <p className="text-xs uppercase tracking-[0.25em] text-[--color-accent]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[--color-fg] md:text-base">
                  {item.detail}
                </p>
              </Reveal>
            ),
          )}
        </div>
      )}

      {slide.isCta && (
        <>
          <Reveal reduce={reduce} delay={0.6} className="mt-10">
            <a
              href={`mailto:${bio.contact.email}`}
              data-cursor="hover"
              className="pointer-events-auto inline-block rounded-full border border-[--color-accent] bg-[--color-accent]/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-[--color-accent] transition-colors hover:bg-[--color-accent]/20"
            >
              {bio.contact.email}
            </a>
          </Reveal>

          <Reveal
            reduce={reduce}
            delay={1.3}
            className="mt-14 flex flex-col items-center text-[10px] uppercase tracking-[0.3em] text-[--color-fg-muted]"
          >
            scroll for the handshake
            <motion.span
              aria-hidden
              className="mt-3 block h-8 w-px bg-[--color-fg-muted]"
              animate={reduce ? undefined : { scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
          </Reveal>
        </>
      )}
    </div>
  );
}
