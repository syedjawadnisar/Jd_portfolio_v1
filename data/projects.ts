export type Project = {
  /** Product / client name, rendered as the display headline. */
  name: string;
  /** Uppercase tracked eyebrow above the name. */
  domain: string;
  /** One-line outcome statement. */
  impact: string;
  /** What Jawad owned, and where he was at the time. Never framed as his own product. */
  role: string;
  stack: readonly string[];
  /**
   * Path to a project still, relative to /public, e.g. "/images/projects/cellcloud.webp".
   * Leave undefined until the file actually exists: ProjectVisual renders a
   * procedural fallback whenever this is missing, and next/image must never be
   * pointed at a file that is not on disk.
   *
   * Expected filenames (16:10, webp — see workspace/guides/image-assets.md):
   *   global-talent-marketplace.webp · cellcloud.webp · moemate.webp · chiirp.webp · docuseal.webp
   */
  image?: string;
  /** Required alongside `image`. Describe the frame, not the company. */
  imageAlt?: string;
  /** Optional per-project tint (hex). Falls back to the global accent token. */
  accent?: string;
  /**
   * Public organisation site only, never an app or internal endpoint. Leave it
   * unset for any client that must not be linked.
   */
  url?: string;
};

export const featuredProjects: readonly Project[] = [
  {
    name: "Global talent marketplace",
    domain: "FinTech / HR-SaaS",
    impact:
      "Engineered an end-to-end multi-currency billing approval flow and worker discount system.",
    role: "Built the billing approval and discount surface end to end, at Codlinx (formerly Igknight Tech).",
    stack: ["React", "TypeScript", "Ruby on Rails", "GraphQL"],
  },
  {
    name: "CellCloud",
    domain: "Data Infrastructure",
    impact:
      "Architected a real-time pipeline streaming AWS Athena queries over WebSockets at production scale.",
    role: "Owned the streaming layer between Athena and the client, as lead engineer at Codlinx (formerly Igknight Tech).",
    stack: ["Python", "Flask", "AWS Athena", "WebSockets", "PostgreSQL"],
  },
  {
    name: "Moemate",
    domain: "AI / Agents",
    impact:
      "Led an AI-agent platform integrating LLM APIs against a Node + MongoDB backend.",
    role: "Led the platform build and the model integration layer, as lead developer at Codlinx (formerly Igknight Tech).",
    stack: ["Node.js", "TypeScript", "MongoDB", "Redis", "AWS OpenSearch", "LLM APIs"],
  },
  {
    name: "CHIIRP",
    domain: "Marketing Automation",
    impact:
      "Moved legacy AJAX to Rails Turbo, then the monolith to microservices, with Sidekiq and query tuning that cut the server bill.",
    role: "Led remote development on contract with a US client.",
    stack: ["Ruby on Rails", "Turbo", "React", "Sidekiq", "PostgreSQL"],
    url: "https://chiirp.com",
  },
  {
    name: "Docuseal",
    domain: "Document Security · Open Source",
    impact:
      "Shipped enterprise-grade coordinate-level PDF text redaction.",
    role: "Shipped the redaction capability into the open-source product, at Cybros.Dev.",
    stack: ["Ruby on Rails", "Vue.js", "PostgreSQL", "PDF tooling"],
    url: "https://www.docuseal.com",
  },
];
