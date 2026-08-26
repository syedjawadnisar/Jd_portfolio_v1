import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing/LandingExperience";
import { LandingJsonLd } from "@/components/seo/LandingJsonLd";
import { bio } from "@/data/bio";
import { siteUrl } from "@/lib/site";

// The one route that cannot use the layout's title.template: Next applies a
// template only to segments BELOW the one that declares it, and app/page.tsx
// shares the root segment with app/layout.tsx. Declared absolute so the brand
// title is stated once, not silently inherited and not double-suffixed.
const ogTitle = `${bio.name} — ${bio.title}`;
const description =
  "Pick a path — the 50-second cut or the playable one — or just keep scrolling for the whole story.";
// The bare origin, matching the form Next emits for the root canonical.
const url = siteUrl;

export const metadata: Metadata = {
  title: { absolute: ogTitle },
  description,
  alternates: { canonical: url },
  openGraph: {
    title: ogTitle,
    description,
    url,
    siteName: bio.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: ogTitle, description },
};

export default function LandingPage() {
  return (
    <>
      <LandingJsonLd />
      <LandingExperience />
    </>
  );
}
