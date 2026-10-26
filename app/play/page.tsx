import type { Metadata } from "next";
import PlayClient from "@/components/play/PlayClient";
import { bio } from "@/data/bio";
import { siteUrl } from "@/lib/site";

// Bare title — the root layout's title.template appends the name.
const title = "The Interactive Journey";
const ogTitle = `${title} — ${bio.name}`;
const description =
  "A playable path through the portfolio: three questions, three worlds, one mystery box.";
const url = new URL("/play/", siteUrl).toString();

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

export default function PlayPage() {
  return <PlayClient />;
}
