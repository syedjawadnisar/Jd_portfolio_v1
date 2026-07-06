import type { Metadata } from "next";
import { CinematicExperience } from "@/components/cinematic/CinematicExperience";
import { JourneyFooter } from "@/components/footer/JourneyFooter";

export const metadata: Metadata = {
  title: "60 Seconds — Jawad Nisar",
  description:
    "The hands-free cinematic cut: who, what, and why — in one minute.",
};

export default function CinematicPage() {
  return (
    <main className="relative">
      <CinematicExperience />
      <JourneyFooter />
    </main>
  );
}
