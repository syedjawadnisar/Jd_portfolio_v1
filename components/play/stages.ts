/**
 * The whole journey as data — three stages, three worlds.
 * Each stage bundles its question, its palette, and its course layout,
 * so this file reads like a level editor. Rendering lives in Level.tsx,
 * flow in PlayExperience.tsx.
 *
 * Physics envelope (Player.tsx: jump 9.6, gravity 22, run speed 6):
 *   max jump height ~2.09, max flat jump distance ~5.2.
 *   Every clearance below is designed inside that envelope.
 */

export type AnswerTone = "build" | "plumber" | "unknown";

export type StageId = "brief" | "timeline" | "vision";

export type StageChip = {
  label: string;
  kind: AnswerTone;
  /** Clause slotted into the finale synthesis. Lowercase, reads mid-sentence. */
  fragment: string;
  /** One-liner for the quick checkpoint beat after the run. */
  checkpoint: string;
};

export type StageAnswer = {
  stageId: StageId;
  question: string;
  answerLabel: string;
  kind: AnswerTone;
  fragment: string;
  checkpoint: string;
};

export type StageTheme = {
  /** DOM + WebGL accent (three.js can't read CSS vars — literals only). */
  accent: string;
  accentSoft: string;
  ground: string;
  block: string;
  /** Secondary wireframe/background color. */
  wire: string;
  /** Rollers and other danger elements. */
  hazard: string;
  fog: string;
  /** Directional light tint. */
  light: string;
  /** DOM radial backdrop color (CSS color string). */
  bgGlow: string;
};

export type LevelLayout = {
  finishX: number;
  /** Ground strips. `top` is the walking surface height (default 0). */
  grounds: { cx: number; w: number; top?: number }[];
  /** Fixed cuboids: crates, pillars, ramps, walls — and floating ledges (cy > h/2). */
  blocks: { cx: number; cy: number; w: number; h: number; rot?: number }[];
  /** Kinematic platforms oscillating vertically on a sine. Player rides them. */
  movers?: { cx: number; w: number; baseY: number; amp: number; period: number; phase?: number }[];
  /** Kinematic spheres patrolling fromX..toX along the ground — forces timing. */
  rollers?: { fromX: number; toX: number; r: number; period: number }[];
  /** Bounce pads: contact launches the player upward (see Level.tsx). */
  pads?: { cx: number }[];
};

export type StageDef = {
  id: StageId;
  name: string;
  eyebrow: string;
  question: string;
  placeholder: string;
  chips: StageChip[];
  theme: StageTheme;
  course: { title: string; subtitle: string };
  layout: LevelLayout;
};

const PLUMBER_LINE =
  "Oops! No plumber found, but we can engineer the system that finds you one.";

export const stages: StageDef[] = [
  // ── STAGE 1 — The Brief ──────────────────────────────────────────────
  // Owner-approved v1 feel: gold on indigo, static geometry, layout A verbatim.
  {
    id: "brief",
    name: "The Brief",
    eyebrow: "The Interactive Journey",
    question: "What are you looking for?",
    placeholder: "e.g. a billing platform that survives Black Friday",
    chips: [
      {
        label: "A web app",
        kind: "build",
        fragment: "a web app",
        checkpoint: "A web app — home turf. Next question: the clock.",
      },
      {
        label: "An AI system",
        kind: "build",
        fragment: "an AI system",
        checkpoint:
          "An AI system — you're speaking my production language. Next: the clock.",
      },
      {
        label: "Something that scales",
        kind: "build",
        fragment: "a platform built to scale",
        checkpoint: "Scale — the fun kind of problem. Next: the clock.",
      },
      {
        label: "A plumber",
        kind: "plumber",
        fragment: "a plumber",
        checkpoint:
          "No plumber on this roster — but keep running, this gets good.",
      },
      {
        label: "I don't know",
        kind: "unknown",
        fragment: "an idea still finding its shape",
        checkpoint:
          "Not knowing is a fine start. Two courses left to figure it out.",
      },
    ],
    theme: {
      accent: "#e8b464",
      accentSoft: "#f5d39a",
      ground: "#20202b",
      block: "#2e2e3d",
      wire: "#a8c8ff",
      hazard: "#f5d39a",
      fog: "#101018",
      light: "#ffffff",
      bgGlow: "oklch(0.22 0.04 270 / 0.55)",
    },
    course: {
      title: "Reach the flag.",
      subtitle: "Four obstacles between you and the reward",
    },
    layout: {
      // v1 layout A — crate, ramp, gap, pillar. Untouched.
      finishX: 33,
      grounds: [
        { cx: 4.5, w: 21 }, // -6 .. 15
        { cx: 29.5, w: 22 }, // 18.5 .. 40.5 (gap 15..18.5 = 3.5, jumpable)
      ],
      blocks: [
        { cx: 6, cy: 0.55, w: 1.1, h: 1.1 }, // crate
        { cx: 10.8, cy: 0.28, w: 3.2, h: 0.4, rot: 0.3 }, // ramp
        { cx: 25, cy: 0.75, w: 1.2, h: 1.5 }, // pillar
      ],
    },
  },

  // ── STAGE 2 — The Timeline ───────────────────────────────────────────
  // Cool world: teal/ice on deep navy. New mechanics: patrol roller + lift.
  {
    id: "timeline",
    name: "The Timeline",
    eyebrow: "The clock wants a word",
    question: "When do you need it?",
    placeholder: "e.g. before the next board meeting",
    chips: [
      {
        label: "Yesterday",
        kind: "build",
        fragment: "needed yesterday",
        checkpoint:
          "Yesterday, noted. That's why the stack stays boring and the shipping stays fast.",
      },
      {
        label: "This quarter",
        kind: "build",
        fragment: "shipped this quarter",
        checkpoint:
          "This quarter — real runway. Enough to do it right the first time.",
      },
      {
        label: "This year",
        kind: "build",
        fragment: "landing this year",
        checkpoint:
          "This year — room to architect it properly, not just build it.",
      },
      {
        label: "Just exploring",
        kind: "unknown",
        fragment: "on an open timeline",
        checkpoint: "Exploring is a speed, not a stall. One question left.",
      },
    ],
    theme: {
      accent: "#6cb8d6",
      accentSoft: "#a8d8e8",
      ground: "#152230",
      block: "#22384d",
      wire: "#a8d8e8",
      hazard: "#e6f2f8",
      fog: "#0d1722",
      light: "#dceaf4",
      bgGlow: "oklch(0.24 0.05 230 / 0.5)",
    },
    course: {
      title: "Ride the timeline.",
      subtitle: "Time the roller, catch the lift",
    },
    layout: {
      finishX: 36.5,
      grounds: [
        { cx: 2.5, w: 17 }, // -6 .. 11 — start plain
        { cx: 24, w: 12, top: 2.4 }, // 18 .. 30 — high plateau, lift required
        { cx: 36.2, w: 8.5 }, // 31.95 .. 40.45 — finish stretch
      ],
      blocks: [
        { cx: 3, cy: 0.55, w: 1.1, h: 1.1 }, // warm-up crate
        { cx: 24.5, cy: 2.95, w: 1.2, h: 1.1 }, // crate on the plateau
      ],
      // Ice sphere patrolling the first stretch — wait for its swing or jump it.
      rollers: [{ fromX: 5.5, toX: 9.5, r: 0.55, period: 3.2 }],
      // The lift: platform top swings 0.2 .. 2.2; plateau top is 2.4,
      // unreachable from the ground (max jump 2.09) — you must ride up.
      movers: [{ cx: 14.5, w: 3.2, baseY: 1, amp: 1, period: 5 }],
    },
  },

  // ── STAGE 3 — The Vision ─────────────────────────────────────────────
  // Warm ember: rose on charcoal. New mechanics: bounce pad + narrow ledges.
  {
    id: "vision",
    name: "The Vision",
    eyebrow: "One question from the box",
    question: "How big is the vision?",
    placeholder: "e.g. a rewrite of the legacy core",
    chips: [
      {
        label: "An MVP to validate",
        kind: "build",
        fragment: "sized to validate fast",
        checkpoint: "An MVP — small surface, sharp aim. Open the box.",
      },
      {
        label: "Scale to millions",
        kind: "build",
        fragment: "built to scale to millions",
        checkpoint: "Millions — now we're talking architecture. Open the box.",
      },
      {
        label: "Rebuild what exists",
        kind: "build",
        fragment: "rebuilt on stronger foundations",
        checkpoint: "A rebuild — the bravest kind of project. Open the box.",
      },
      {
        label: "Not sure yet",
        kind: "unknown",
        fragment: "with room to grow",
        checkpoint: "Unsure is honest. The box knows more.",
      },
    ],
    theme: {
      accent: "#e87a5e",
      accentSoft: "#f2b8a0",
      ground: "#241d1f",
      block: "#3a2b2d",
      wire: "#f2b8a0",
      hazard: "#f5d0c0",
      fog: "#161014",
      light: "#ffe4d4",
      bgGlow: "oklch(0.22 0.05 30 / 0.5)",
    },
    course: {
      title: "Stick the landing.",
      subtitle: "The pad launches, the ledges forgive",
    },
    layout: {
      finishX: 38,
      grounds: [
        { cx: 2, w: 16 }, // -6 .. 10
        { cx: 26.2, w: 8.4 }, // 22 .. 30.4
        { cx: 37.2, w: 9.6 }, // 32.4 .. 42 — finish stretch
      ],
      blocks: [
        { cx: 5, cy: 0.55, w: 1.1, h: 1.1 }, // warm-up crate
        // Narrow ledges across the 10..22 drop — precision without punishment.
        { cx: 12.3, cy: 0.95, w: 1.5, h: 0.3 }, // ledge, top 1.1
        { cx: 15.4, cy: 1.45, w: 1.3, h: 0.3 }, // ledge, top 1.6
        { cx: 18.6, cy: 0.95, w: 1.4, h: 0.3 }, // ledge, top 1.1
        // The wall: top at 3.2 — above max jump (2.09). Pad required.
        { cx: 29.4, cy: 1.6, w: 1.2, h: 3.2 },
      ],
      // Launches to ~5.1 high — clears the wall with margin, lands on g3.
      pads: [{ cx: 27.2 }],
    },
  },
];

export function toAnswer(stage: StageDef, chip: StageChip): StageAnswer {
  return {
    stageId: stage.id,
    question: stage.question,
    answerLabel: chip.label,
    kind: chip.kind,
    fragment: chip.fragment,
    checkpoint: chip.checkpoint,
  };
}

const UNKNOWN_RE = /\b(idk|dunno|no idea|not sure|don'?t know)\b/;

function findChip(stage: StageDef, kind: AnswerTone): StageChip {
  return stage.chips.find((c) => c.kind === kind) ?? stage.chips[0];
}

/** Map free text to a stage chip so it flows through checkpoint + finale. */
export function classifyFreeText(raw: string, stage: StageDef): StageChip {
  const text = raw.trim();
  const lower = text.toLowerCase();

  // Plumber wins over hedging — the joke deserves priority (v1 behavior).
  if (stage.id === "brief" && /plumb/.test(lower)) {
    return { ...findChip(stage, "plumber"), label: text };
  }

  // Threshold stays below real 2-char answers ("AI", "ML", "Q3") so they
  // reach the stage classifiers instead of the unknown fallback.
  if (text.length < 2 || UNKNOWN_RE.test(lower)) {
    return { ...findChip(stage, "unknown"), label: text || "I don't know" };
  }

  if (stage.id === "brief") {
    const noun = /\b(ai|agents?|llms?|ml|models?)\b/.test(lower)
      ? "AI system"
      : /\b(scale|scaling|platform|infra|infrastructure)\b/.test(lower)
        ? "platform"
        : /\b(apps?|site|website|web|product|saas|mvp)\b/.test(lower)
          ? "web app"
          : null;
    return {
      label: text,
      kind: "build",
      fragment: noun ? (noun === "AI system" ? "an AI system" : `a ${noun}`) : "a vision taking shape",
      checkpoint: noun
        ? `A ${noun} — noted. Next question: the clock.`
        : "Noted, in your own words. Next question: the clock.",
    };
  }

  if (stage.id === "timeline") {
    return {
      label: text,
      kind: "build",
      fragment: `on a timeline of "${text}"`,
      checkpoint: "Noted — the calendar answers to the plan. One question left.",
    };
  }

  // vision
  if (/\b(millions?|scale|scaling|global|huge|massive)\b/.test(lower)) {
    return { ...visionChip(stage, "Scale to millions"), label: text };
  }
  if (/\b(mvp|validate|prototype|poc|pilot|small)\b/.test(lower)) {
    return { ...visionChip(stage, "An MVP to validate"), label: text };
  }
  if (/\b(rebuild|rewrite|legacy|migrat\w*|replatform)\b/.test(lower)) {
    return { ...visionChip(stage, "Rebuild what exists"), label: text };
  }
  return {
    label: text,
    kind: "build",
    fragment: `scoped to "${text}"`,
    checkpoint: "A vision in your own words — the best kind. Open the box.",
  };
}

function visionChip(stage: StageDef, label: string): StageChip {
  return stage.chips.find((c) => c.label === label) ?? stage.chips[0];
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * The finale message — one qualified-brief statement built from all three
 * answers. Plumber keeps its verbatim line; unknown-heavy runs get the
 * warm variant instead of pretending a brief exists.
 */
export function buildFinale(answers: StageAnswer[]): string {
  const [what, when, size] = answers;
  if (!what || !when || !size) {
    return "You ran the whole course — the brief is yours to write. I'm the one who ships it.";
  }

  if (what.kind === "plumber") {
    return `${PLUMBER_LINE} And the system behind it — ${when.fragment}, ${size.fragment} — that part I ship personally.`;
  }

  const frags = `${cap(what.fragment)}, ${when.fragment}, ${size.fragment}`;

  const unknowns = answers.filter((a) => a.kind === "unknown").length;
  if (unknowns >= 2) {
    return `${frags} — that's not a blank page, that's a first conversation. Bring the fuzzy idea; I'll bring the plan.`;
  }

  return `${frags} — you just wrote the brief. I'm the one who ships it.`;
}
