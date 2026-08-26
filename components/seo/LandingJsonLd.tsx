import { bio } from "@/data/bio";
import { siteUrl } from "@/lib/site";

/**
 * Person + WebSite structured data for the landing page.
 *
 * Every value is first-party static content from data/bio.ts and the origin
 * resolved in lib/site.ts — nothing is asserted here that the page itself does
 * not already say. No employers, dates, ratings, or credentials: an unverifiable
 * claim in a knowledge-graph feed is worse than no claim at all.
 *
 * Landing only. One canonical entity node per site, referenced by @id.
 */
const [addressLocality, addressCountry] = bio.location
  .split(",")
  .map((part) => part.trim());

const absolute = (path: string) => new URL(path, siteUrl).toString();

export function LandingJsonLd() {
  const personId = absolute("/#person");
  const websiteId = absolute("/#website");

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: bio.name,
        jobTitle: bio.title,
        description: bio.subline,
        url: siteUrl,
        email: `mailto:${bio.contact.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality,
          addressCountry,
        },
        sameAs: [bio.contact.linkedin, bio.contact.github],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: `${bio.name} — ${bio.title}`,
        inLanguage: "en-US",
        author: { "@id": personId },
        publisher: { "@id": personId },
        about: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // First-party static data, serialized — the standard Next JSON-LD path.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
