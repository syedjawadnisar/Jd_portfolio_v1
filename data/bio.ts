export const bio = {
  name: "Jawad Nisar",
  title: "Senior Full-Stack & AI Architect",
  location: "Lahore, Pakistan",

  // DRAFT punchline — easy to swap. Tell me which direction you prefer.
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
    title: "I have 60 seconds",
    label: "Cinematic Auto-Play",
    description: "Hands-free. Highlights only. The fastest path to “let’s talk.”",
    duration: "~60s",
  },
  {
    href: "/explore",
    title: "I want to explore",
    label: "The Architect's Scroll",
    description: "Scroll-controlled. Particles and 3D follow your pace.",
    duration: "self-paced",
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
