import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Jawad Nisar — Senior Full-Stack & AI Architect",
  description:
    "Engineer at the intersection of architecture, AI, and infrastructure. I build the systems other teams talk about.",
  metadataBase: new URL("https://jawadnisar.example"),
  openGraph: {
    title: "Jawad Nisar — Senior Full-Stack & AI Architect",
    description:
      "Engineer at the intersection of architecture, AI, and infrastructure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen antialiased">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
