export type Project = {
  /** Product / client name, rendered as the display headline. */
  name: string;
  /** Uppercase tracked eyebrow above the name. */
  domain: string;
  /** One-line outcome statement. */
  impact: string;
  /** What Jawad personally owned on the engagement. */
  role: string;
  stack: readonly string[];
  /**
   * Path to a project still, relative to /public — e.g. "/images/projects/toptal.webp".
   * Leave undefined until the file actually exists: ProjectVisual renders a
   * procedural fallback whenever this is missing, and next/image must never be
   * pointed at a file that is not on disk.
   *
   * Expected filenames (16:10, webp — see workspace/guides/image-assets.md):
   *   toptal.webp · cellcloud.webp · moemate.webp · chiirp.webp · docuseal.webp
   */
  image?: string;
  /** Required alongside `image`. Describe the frame, not the company. */
  imageAlt?: string;
  /** Optional per-project tint (hex). Falls back to the global accent token. */
  accent?: string;
};

export const featuredProjects: readonly Project[] = [
  {
    name: "Toptal",
    domain: "FinTech / HR-SaaS",
    impact:
      "Engineered an end-to-end multi-currency billing approval flow and worker discount system.",
    role: "Owned the billing approval and discount surface end to end.",
    stack: ["React", "Node.js", "TypeScript"],
  },
  {
    name: "CellCloud",
    domain: "Data Infrastructure",
    impact:
      "Architected a real-time pipeline streaming AWS Athena queries over WebSockets at production scale.",
    role: "Architected the streaming layer between Athena and the client.",
    stack: ["Python", "Flask", "AWS Athena", "WebSockets"],
  },
  {
    name: "Moemate",
    domain: "AI / Agents",
    impact:
      "Led an AI-agent platform integrating LLM APIs against a Node + MongoDB backend.",
    role: "Led the platform build and the model integration layer.",
    stack: ["Node.js", "MongoDB", "LLM APIs"],
  },
  {
    name: "CHIIRP",
    domain: "Marketing Automation",
    impact:
      "Modernized a legacy monolith into microservices and tuned Sidekiq jobs for throughput under load.",
    role: "Drove the monolith-to-services migration and background-job throughput.",
    stack: ["Ruby on Rails", "Sidekiq", "PostgreSQL"],
  },
  {
    name: "Docuseal",
    domain: "Document Security · Open Source",
    impact:
      "Shipped enterprise-grade coordinate-level PDF text redaction.",
    role: "Shipped the redaction capability into an open-source product.",
    stack: ["Ruby on Rails", "PDF tooling"],
  },
];
