export type Project = {
  /** Stable id, the same slug the second portfolio uses. Also the image filename stem. */
  slug: string;
  /** Product / client name, rendered as the display headline. */
  name: string;
  /** Uppercase tracked eyebrow above the name. */
  domain: string;
  /** One-line outcome statement. */
  impact: string;
  /** What Jawad owned, and where he was at the time. Never framed as his own product. */
  role: string;
  stack: readonly string[];
  /** Year or period, only where it is actually known. */
  period?: string;
  /** One of the large rows on the landing, in list order. Everything else lives on /projects. */
  featured?: boolean;
  /**
   * Path to a project still, relative to /public, e.g. "/images/projects/kscope.webp".
   * Leave undefined until the file actually exists: ProjectVisual renders a
   * procedural fallback whenever this is missing, and next/image must never be
   * pointed at a file that is not on disk.
   *
   * Expected filenames, 16:10 webp, one per featured project, named `${slug}.webp`.
   * Specs in workspace/guides/image-assets.md.
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

/**
 * Every project on the site. The featured six come first, in the order the
 * landing shows them, and the rest appear only on /projects. Wording follows
 * the second portfolio's live copy, so the two sites never disagree.
 */
export const projects: readonly Project[] = [
  {
    slug: "public-safety-workforce-platform",
    name: "Public-safety workforce platform",
    domain: "Public safety / AWS GovCloud",
    impact:
      "Delivered an isolated AWS GovCloud deployment end to end, for a multi-tenant SaaS on Lambda, GraphQL and Terraform.",
    role: "Full-stack engineer across backend, frontend, infrastructure and release engineering, at Codlinx (formerly Igknight Tech).",
    stack: ["TypeScript", "GraphQL", "AWS Lambda", "Terraform", "MongoDB", "React", "Node.js", "AWS GovCloud"],
    period: "2026, ongoing",
    featured: true,
    image: "/images/projects/public-safety-workforce-platform.webp",
    imageAlt: "Illustration of a shift-scheduling dashboard and a phone, linked by threads of light",
  },
  {
    slug: "kscope",
    name: "KScope",
    domain: "Knowledge platform / billing and entitlements",
    impact:
      "Built the commercial layer of a Go microservices platform: subscriptions, a credit ledger and self-serve upgrades.",
    role: "Lead developer across more than ten repositories, at Codlinx (formerly Igknight Tech).",
    stack: ["Go", "GraphQL", "PostgreSQL", "AWS SQS", "Stripe", "React", "TypeScript", "AWS Cognito", "AWS CDK"],
    featured: true,
    url: "https://kscope.ai",
    image: "/images/projects/kscope.webp",
    imageAlt: "Illustration of a knowledge graph, three plan cards and a usage meter, synced from a layer below",
  },
  {
    slug: "intelligencex",
    name: "IntelligenceX",
    domain: "LLM compliance scoring / insurance call centers",
    impact:
      "Turned call recordings into LLM-scored compliance scorecards for insurance call centers.",
    role: "Full-stack engineer on ingestion, scheduled jobs and the scorecard prompt runner, at Codlinx (formerly Igknight Tech).",
    stack: ["Ruby on Rails", "React", "PostgreSQL", "LLM APIs", "Solid Queue", "TypeScript", "Deepgram", "AWS"],
    featured: true,
    image: "/images/projects/intelligencex.webp",
    imageAlt: "Illustration of a call waveform, a ring chart and a scorecard, joined by a stream of light",
  },
  {
    slug: "global-talent-marketplace",
    name: "Global talent marketplace",
    domain: "FinTech / HR-SaaS",
    impact:
      "Engineered an end-to-end multi-currency billing approval flow and worker discount system.",
    role: "Built the billing approval and discount surface end to end, at Codlinx (formerly Igknight Tech).",
    stack: ["React", "TypeScript", "Ruby on Rails", "GraphQL"],
    featured: true,
    image: "/images/projects/global-talent-marketplace.webp",
    imageAlt: "Illustration of invoices in different currencies, an approval flow and a discount tag",
  },
  {
    slug: "chiirp",
    name: "CHIIRP",
    domain: "Marketing Automation",
    impact:
      "Moved legacy AJAX to Rails Turbo, then the monolith to microservices, with Sidekiq and query tuning that cut the server bill.",
    role: "Led remote development on contract with a US client.",
    stack: ["Ruby on Rails", "Turbo", "React", "Sidekiq", "PostgreSQL"],
    period: "2025",
    featured: true,
    url: "https://chiirp.com",
    image: "/images/projects/chiirp.webp",
    imageAlt: "Illustration of a campaign sequence, a conversation and two synced apps over a grid of services",
  },
  {
    slug: "docuseal",
    name: "Docuseal",
    domain: "Document Security · Open Source",
    impact:
      "Shipped enterprise-grade coordinate-level PDF text redaction.",
    role: "Shipped the redaction capability into the open-source product, at Cybros.Dev.",
    stack: ["Ruby on Rails", "Vue.js", "PostgreSQL", "PDF tooling"],
    featured: true,
    url: "https://www.docuseal.com",
    image: "/images/projects/docuseal.webp",
    imageAlt: "Illustration of a layered document with one region redacted through every layer, beside signature fields",
  },
  {
    slug: "cellcloud",
    name: "CellCloud",
    domain: "Data Infrastructure",
    impact:
      "Architected a real-time pipeline streaming AWS Athena queries over WebSockets at production scale.",
    role: "Owned the streaming layer between Athena and the client, as lead engineer at Codlinx (formerly Igknight Tech).",
    stack: ["Python", "Flask", "AWS Athena", "WebSockets", "PostgreSQL"],
  },
  {
    slug: "moemate",
    name: "Moemate",
    domain: "AI / Agents",
    impact:
      "Led an AI-agent platform integrating LLM APIs against a Node + MongoDB backend.",
    role: "Led the platform build and the model integration layer, as lead developer at Codlinx (formerly Igknight Tech).",
    stack: ["Node.js", "TypeScript", "MongoDB", "Redis", "AWS OpenSearch", "LLM APIs"],
  },
  {
    slug: "eliza-agent",
    name: "Eliza Agent",
    domain: "AI agents",
    impact: "A social media AI agent that can take on any character.",
    role: "Engineer at Codlinx (formerly Igknight Tech).",
    stack: ["Node.js", "LLM APIs", "NoSQL"],
  },
  {
    slug: "labweb",
    name: "Labweb",
    domain: "SaaS portal / lab software",
    impact: "A lab SaaS portal, with PDFs precise enough for a test vial.",
    role: "Full-stack engineer at Cybros.Dev.",
    stack: ["Ruby on Rails", "Next.js", "PostgreSQL", "Prawn"],
  },
  {
    slug: "case-manager",
    name: "Case Manager",
    domain: "SaaS / dashboards",
    impact: "Dynamic dashboards, N+1 bottlenecks removed, payments wired in.",
    role: "Full-stack engineer at Cybros.Dev, on schema design and integrations.",
    stack: ["Ruby on Rails", "PostgreSQL", "Stripe", "QuickBooks API"],
  },
  {
    slug: "job-portal-platform",
    name: "Job portal platform",
    domain: "Payments, chat and notifications",
    impact: "A job portal with real-time chat, payments and notifications.",
    role: "Full-stack engineer.",
    stack: ["Ruby on Rails", "Stripe", "ActionCable", "Bootstrap", "Heroku"],
  },
  {
    slug: "everybooking",
    name: "Everybooking",
    domain: "Booking platform",
    impact: "Slow Turbo interactions rebuilt as fast React components.",
    role: "Full-stack engineer.",
    stack: ["React", "Ruby on Rails", "DnD Kit"],
    url: "https://everybooking.com",
  },
  {
    slug: "commercial-truck-quotes",
    name: "Commercial Truck Quotes",
    domain: "Insurance marketplace",
    impact: "Real-time insurance quote matching for truckers and agencies.",
    role: "Full-stack engineer.",
    stack: ["Ruby on Rails", "Vue.js", "Vuex", "Vuetify", "Bootstrap"],
    url: "https://www.commercialtruckquotes.com",
  },
  {
    slug: "wellx",
    name: "Wellx",
    domain: "Customer portal",
    impact: "Custom APIs and new portal pages on a Rails and React stack.",
    role: "Full-stack engineer.",
    stack: ["React", "Ruby on Rails", "Ant Design", "MUI"],
    url: "https://wellxai.com",
  },
  {
    slug: "store-management",
    name: "Store Management",
    domain: "Multi-store inventory sync",
    impact: "Inventory kept in sync across Shopify stores, QuickBooks and a POS.",
    role: "Full-stack engineer.",
    stack: ["Shopify API", "QuickBooks API", "Korona POS API", "Heroku"],
  },
];

export const featuredProjects: readonly Project[] = projects.filter((p) => p.featured);

/** Three small, older builds, collapsed into one line rather than three cards. */
export const earlierWork =
  "Earlier: a classified-ads app on Rails with Tailwind and Stimulus, a DAO app on Next.js, and a single-page Rails site with smooth scrolling.";
