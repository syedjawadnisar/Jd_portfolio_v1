import type { Metadata } from "next";
import { CinematicExperience } from "@/components/cinematic/CinematicExperience";
import { JourneyFooter } from "@/components/footer/JourneyFooter";

const title = "The 50-Second Cut — Jawad Nisar";
const description =
  "The hands-free cinematic cut: who, what, and why — in under a minute.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function CinematicPage() {
  return (
    <main className="relative">
      <CinematicExperience />
      <JourneyFooter />
    </main>
  );
}
