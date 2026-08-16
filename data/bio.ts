export const bio = {
  name: "Jawad Nisar",
  title: "Senior Full-Stack & AI Architect",
  location: "Lahore, Pakistan",

  // Split into sans + italic display serif at a fixed word index: Hero.tsx
  // (SERIF_FROM) and data/slides.ts (MOTTO_SERIF_FROM) both slice at 4, so
  // an edit that changes the word count needs both indices revisited.
  motto: "I architect the systems other teams talk about.",
  subline:
    "Lead-tier engineering for the platforms that move money, manage people, and ship at global scale.",

  contact: {
    email: "jawadnisar77@gmail.com",
    linkedin: "https://linkedin.com/in/jawadnisar",
    github: "https://github.com/syedjawadnisar",
  },
} as const;

export const paths = [
  {
    href: "/cinematic",
    title: "I have a minute",
    label: "Cinematic Auto-Play",
    description: "Hands-free. Highlights only. The fastest path to “let’s talk.”",
    duration: "~50s",
  },
  {
    href: "/play",
    title: "Let's play a game",
    label: "The Interactive Journey",
    description:
      "Find out if I'm the right hire — through a mini platformer, not a form.",
    duration: "~3 min",
  },
] as const;
