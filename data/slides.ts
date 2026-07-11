import { bio } from "./bio";
import { skillCategories } from "./skills";
import { featuredProjects } from "./projects";

/**
 * Placeholder for the experience word ("Five", "Six", …). The deck stays
 * date-agnostic so /cinematic can be statically prerendered without baking a
 * stale number into build-time HTML; ChapterView substitutes the current
 * word at render via useExperienceYears().
 */
export const YEARS_TOKEN = "{years}";

export type SlideSegment = {
  readonly text: string;
  /** Rendered in italic display serif with the soft accent color. */
  readonly serif?: boolean;
};

export type SlideItem = {
  readonly title: string;
  readonly detail: string;
  readonly meta?: string;
};

export type Slide = {
  readonly id: string;
  readonly kicker: string;
  /** Segments are joined with a single space at render time. */
  readonly heading: readonly SlideSegment[];
  readonly body?: string;
  readonly items?: readonly SlideItem[];
  readonly durationMs: number;
  readonly isCta?: boolean;
};

/* ------------------------------------------------------------------ */
/* Curation helpers — pull from the single sources of truth,           */
/* trim for a 100vh slide.                                             */
/* ------------------------------------------------------------------ */

type SkillLabel = (typeof skillCategories)[number]["label"];

function pickSkills(label: SkillLabel, take: number): string {
  const category = skillCategories.find((c) => c.label === label);
  return category ? category.items.slice(0, take).join(" · ") : "";
}

// Motto splits into sans → serif exactly like the landing hero.
const MOTTO_SERIF_FROM = 4;
const mottoWords = bio.motto.split(" ");

/* ------------------------------------------------------------------ */
/* The deck — 7 slides, ~47 seconds total. Pacing is intentional:      */
/* short hook, longest hold on the three-project chapter.              */
/* ------------------------------------------------------------------ */

export const slides: readonly Slide[] = [
  {
    id: "hook",
    kicker: `${bio.name} — ${bio.title}`,
    heading: [
      { text: mottoWords.slice(0, MOTTO_SERIF_FROM).join(" ") },
      { text: mottoWords.slice(MOTTO_SERIF_FROM).join(" "), serif: true },
    ],
    durationMs: 6000,
  },
  {
    id: "who",
    kicker: "01 — Who",
    heading: [
      { text: `Lahore. ${YEARS_TOKEN} years deep.` },
      { text: "Lead-tier scope.", serif: true },
    ],
    body: "Shipping production systems since 2021 — billing flows that move money across borders, AI agents that hold conversations, pipelines that don't flinch under load. The years aren't the story. The output is.",
    durationMs: 7000,
  },
  {
    id: "arsenal",
    kicker: "02 — Arsenal",
    heading: [{ text: "Full-stack," }, { text: "end to end.", serif: true }],
    items: [
      { title: "Frontend", detail: pickSkills("Frontend", 3) },
      { title: "Backend", detail: pickSkills("Backend", 4) },
      { title: "Cloud & DevOps", detail: pickSkills("Cloud & DevOps", 3) },
      { title: "Architecture", detail: pickSkills("Architecture", 3) },
    ],
    durationMs: 7000,
  },
  {
    id: "superpower",
    kicker: "03 — The superpower",
    heading: [
      { text: "Infrastructure that" },
      { text: "knows itself.", serif: true },
    ],
    body: "Error-handling that diagnoses itself. Pipelines that route around their own failures. Agents that turn fuzzy intent into reliable side effects. AI isn't a feature I bolt on — it's how my systems think.",
    durationMs: 7000,
  },
  {
    id: "rhythm",
    kicker: "04 — Operating rhythm",
    heading: [{ text: "Rhythm" }, { text: "over ritual.", serif: true }],
    body: "Jira, Asana, Zendesk, GitHub Actions — pick the cadence, I'll run it. Sprints that move. Retros that change behavior. Dashboards that tell the truth.",
    durationMs: 5500,
  },
  {
    id: "work",
    kicker: "05 — Featured work",
    heading: [{ text: "Systems in" }, { text: "production.", serif: true }],
    items: featuredProjects.slice(0, 3).map((p) => ({
      title: p.name,
      detail: p.impact,
      meta: p.domain,
    })),
    durationMs: 8000,
  },
  {
    id: "cta",
    kicker: "06 — Your move",
    heading: [{ text: "Let's" }, { text: "talk.", serif: true }],
    body: "Tell me what you're trying to build. I'll tell you whether I'm the one to ship it.",
    durationMs: 6500,
    isCta: true,
  },
] as const;
