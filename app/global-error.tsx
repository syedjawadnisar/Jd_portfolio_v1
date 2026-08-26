"use client";

import type { CSSProperties } from "react";
import { bio } from "@/data/bio";

/**
 * The last boundary.
 *
 * `app/error.tsx` is a segment boundary: it renders *inside* the root layout,
 * so it can only catch what the page tree throws. A failure in the layout
 * itself — the font loader, `<Cursor />`, anything above the segment — takes
 * the layout down with it and there is nothing left to render the recovery UI
 * into. This file replaces the document instead, which is why it has to own
 * its own `<html>` and `<body>`.
 *
 * Everything here is deliberately self-contained. `globals.css` is imported by
 * the root layout, and the root layout is exactly what may have just failed,
 * so no token, no `--font-*` variable and no Tailwind class can be assumed to
 * exist. The colors below are the literal token values and the type falls back
 * through the stacks the theme already names. No WebGL, no motion library, no
 * network request: this screen has one job, and it must be the most reliable
 * thing on the site.
 */

// Literal mirrors of the @theme tokens in app/globals.css, in case the
// stylesheet never loaded. Kept in sync by hand — there are five of them and
// they only describe this one screen.
const BG = "#0c0d18";
const BG_ELEVATED = "#16172a";
const FG = "#f1f1f6";
const FG_MUTED = "#9b9bad";
const ACCENT = "#e8b464";
const BORDER = "#2d2e3d";

const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

const styles = {
  // `cursor: auto` is explicit: if globals.css *did* load, its base layer
  // hides the native cursor on fine pointers in favor of the bespoke one —
  // and the component that draws that cursor lives in the layout that just
  // died. An invisible pointer on the recovery screen is a dead end.
  html: { colorScheme: "dark", cursor: "auto" },
  body: {
    margin: 0,
    minHeight: "100svh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6rem 1.5rem",
    background: BG,
    color: FG,
    font: `400 16px/1.6 ${SANS}`,
    WebkitFontSmoothing: "antialiased",
    cursor: "auto",
  },
  card: {
    width: "100%",
    maxWidth: "32rem",
    padding: "2.5rem 2rem",
    textAlign: "center",
    border: `1px solid ${BORDER}`,
    borderRadius: "1rem",
    background: BG_ELEVATED,
  },
  eyebrow: {
    margin: "0 0 1rem",
    fontSize: "0.75rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: FG_MUTED,
  },
  heading: {
    margin: 0,
    font: `italic 400 1.875rem/1.15 ${SERIF}`,
    letterSpacing: "-0.01em",
  },
  copy: {
    margin: "1rem 0 0",
    fontSize: "0.875rem",
    lineHeight: 1.7,
    color: FG_MUTED,
  },
  button: {
    display: "inline-block",
    margin: "2rem 0 0",
    padding: "0.85rem 2rem",
    font: `500 0.875rem/1 ${SANS}`,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: ACCENT,
    background: "transparent",
    border: `1px solid ${ACCENT}`,
    borderRadius: "999px",
    cursor: "pointer",
  },
  links: {
    margin: "1.5rem 0 0",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.25rem",
  },
  link: {
    fontSize: "0.6875rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: FG_MUTED,
    textDecoration: "none",
  },
  digest: {
    margin: "1.5rem 0 0",
    fontSize: "0.625rem",
    letterSpacing: "0.15em",
    color: BORDER,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
} satisfies Record<string, CSSProperties>;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" style={styles.html}>
      <body style={styles.body}>
        <title>Something broke — Jawad Nisar</title>
        <main style={styles.card}>
          <p style={styles.eyebrow}>The floor gave out</p>
          <h1 style={styles.heading}>
            This one failed all the way to the root.
          </h1>
          <p style={styles.copy}>
            Not a graceful degradation — a real fault, and the honest thing is
            to say so. Reload and it usually comes back. If it doesn&apos;t, the
            conversation was always the point.
          </p>

          <button type="button" onClick={reset} style={styles.button}>
            Reload the site
          </button>

          <div style={styles.links}>
            {/* A hard navigation on purpose: client-side routing lives in the
                tree that just came down, so `next/link` would prefetch and
                soft-navigate through a router this document no longer has. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={styles.link}>
              back to home
            </a>
            <a href={`mailto:${bio.contact.email}`} style={styles.link}>
              {bio.contact.email}
            </a>
          </div>

          {/* Quiet, but there: gives a visitor something to quote. */}
          {error.digest ? (
            <p style={styles.digest}>ref {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
