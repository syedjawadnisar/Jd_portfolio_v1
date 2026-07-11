import type { Metadata } from "next";
import PlayClient from "@/components/play/PlayClient";

export const metadata: Metadata = {
  title: "The Interactive Journey — Jawad Nisar",
  description:
    "A playable path through the portfolio: three questions, three worlds, one mystery box.",
};

export default function PlayPage() {
  return <PlayClient />;
}
