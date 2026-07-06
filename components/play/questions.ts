export type AnswerTone = "build" | "plumber" | "unknown";

export type Answer = {
  label: string;
  tone: AnswerTone;
  message: string;
};

export type RoundDef = {
  question: string;
  chips: Answer[];
  placeholder: string;
};

const PLUMBER: Answer = {
  label: "A plumber",
  tone: "plumber",
  message:
    "Oops! No plumber found, but we can engineer the system that finds you one.",
};

const UNKNOWN: Answer = {
  label: "I don't know",
  tone: "unknown",
  message:
    "Not knowing is the right place to start. Bring the fuzzy idea, leave with a plan — the first conversation is free.",
};

export const rounds: RoundDef[] = [
  {
    question: "What are you looking for?",
    chips: [
      {
        label: "A web app",
        tone: "build",
        message:
          "Yoohoo! You got the perfect loyal companion to build your web app.",
      },
      {
        label: "An AI system",
        tone: "build",
        message:
          "Yoohoo! You got the perfect loyal companion to build your AI system.",
      },
      {
        label: "Something that scales",
        tone: "build",
        message:
          "Yoohoo! You got the perfect loyal companion to build the platform that scales.",
      },
      PLUMBER,
      UNKNOWN,
    ],
    placeholder: "e.g. a billing platform that survives Black Friday",
  },
  {
    question: "When do you need it?",
    chips: [
      {
        label: "Yesterday",
        tone: "build",
        message:
          "Yoohoo! You got a companion built for yesterday-deadlines. We start now.",
      },
      {
        label: "This quarter",
        tone: "build",
        message:
          "Yoohoo! You got a companion who ships in weeks, not quarters. Plenty of runway.",
      },
      {
        label: "Just exploring",
        tone: "unknown",
        message:
          "Exploring is the right speed. No pitch, no pressure — the first conversation is free.",
      },
    ],
    placeholder: "e.g. before the next board meeting",
  },
];

/** Map free text to an Answer. roundIndex is 0-based into `rounds`. */
export function classifyFreeText(raw: string, roundIndex: number): Answer {
  const text = raw.trim();
  const lower = text.toLowerCase();

  if (/plumb/.test(lower)) return { ...PLUMBER, label: text };

  if (
    text.length < 3 ||
    /\b(idk|dunno|no idea|not sure|don'?t know)\b/.test(lower)
  ) {
    return { ...UNKNOWN, label: text || UNKNOWN.label };
  }

  if (roundIndex >= 1) {
    return {
      label: text,
      tone: "build",
      message:
        "Yoohoo! You got a loyal companion who works on exactly that timeline.",
    };
  }

  const noun = /\b(ai|agents?|llms?|ml|models?)\b/.test(lower)
    ? "AI system"
    : /\b(scale|scaling|platform|infra|infrastructure)\b/.test(lower)
      ? "platform"
      : /\b(apps?|site|website|web|product|saas|mvp)\b/.test(lower)
        ? "web app"
        : "vision";

  return {
    label: text,
    tone: "build",
    message: `Yoohoo! You got the perfect loyal companion to build your ${noun}.`,
  };
}
