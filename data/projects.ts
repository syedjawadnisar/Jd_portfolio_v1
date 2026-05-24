export const featuredProjects = [
  {
    name: "Toptal",
    domain: "FinTech / HR-SaaS",
    impact:
      "Engineered an end-to-end multi-currency billing approval flow and worker discount system.",
    stack: ["React", "Node.js", "TypeScript"],
  },
  {
    name: "CellCloud",
    domain: "Data Infrastructure",
    impact:
      "Architected a real-time pipeline streaming AWS Athena queries over WebSockets at production scale.",
    stack: ["Python", "Flask", "AWS Athena", "WebSockets"],
  },
  {
    name: "Moemate",
    domain: "AI / Agents",
    impact:
      "Led an AI-agent platform integrating LLM APIs against a Node + MongoDB backend.",
    stack: ["Node.js", "MongoDB", "LLM APIs"],
  },
  {
    name: "CHIIRP",
    domain: "Marketing Automation",
    impact:
      "Modernized a legacy monolith into microservices and tuned Sidekiq jobs for throughput under load.",
    stack: ["Ruby on Rails", "Sidekiq", "PostgreSQL"],
  },
  {
    name: "Docuseal",
    domain: "Document Security · Open Source",
    impact:
      "Shipped enterprise-grade coordinate-level PDF text redaction.",
    stack: ["Ruby on Rails", "PDF tooling"],
  },
] as const;
