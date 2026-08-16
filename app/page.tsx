import type { Metadata } from "next";
import { LandingExperience } from "@/components/landing/LandingExperience";

const title = "Jawad Nisar — Senior Full-Stack & AI Architect";
const description =
  "Pick a path — the 50-second cut or the playable one — or just keep scrolling for the whole story.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function LandingPage() {
  return <LandingExperience />;
}
