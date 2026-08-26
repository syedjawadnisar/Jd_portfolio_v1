import type { Metadata } from "next";
import { CinematicExperience } from "@/components/cinematic/CinematicExperience";
import { JourneyFooter } from "@/components/footer/JourneyFooter";
import { bio } from "@/data/bio";
import { siteUrl } from "@/lib/site";

// Bare title — the root layout's title.template appends the name.
const title = "The 50-Second Cut";
const ogTitle = `${title} — ${bio.name}`;
const description =
  "The hands-free cinematic cut: who, what, and why — in under a minute.";
const url = new URL("/cinematic", siteUrl).toString();

export const metadata: Metadata = {
  title,
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

export default function CinematicPage() {
  return (
    <main className="relative">
      <CinematicExperience />
      <JourneyFooter />
    </main>
  );
}
