import type { Metadata } from "next";
import { CinematicExperience } from "@/components/cinematic/CinematicExperience";
import { JourneyFooter } from "@/components/footer/JourneyFooter";

export const metadata: Metadata = {
  title: "The 50-Second Cut — Jawad Nisar",
  description:
    "The hands-free cinematic cut: who, what, and why — in under a minute.",
};

export default function CinematicPage() {
  return (
    <main className="relative">
      <CinematicExperience />
      <JourneyFooter />
    </main>
  );
}
