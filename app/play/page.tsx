import type { Metadata } from "next";
import PlayClient from "@/components/play/PlayClient";

const title = "The Interactive Journey — Jawad Nisar";
const description =
  "A playable path through the portfolio: three questions, three worlds, one mystery box.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function PlayPage() {
  return <PlayClient />;
}
