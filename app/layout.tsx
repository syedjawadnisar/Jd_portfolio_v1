import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Every font-display usage on the site pairs the serif with italic — the
// roman face would preload without ever painting a glyph.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
});

/**
 * Absolute base for OG/Twitter card URLs. Set NEXT_PUBLIC_SITE_URL to the
 * deployment origin (e.g. https://your-domain.com); the localhost fallback
 * keeps dev previews resolvable instead of pointing at a dead host.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Jawad Nisar — Senior Full-Stack & AI Architect",
  description:
    "Engineer at the intersection of architecture, AI, and infrastructure. I build the systems other teams talk about.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Jawad Nisar — Senior Full-Stack & AI Architect",
    description:
      "Engineer at the intersection of architecture, AI, and infrastructure.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jawad Nisar — Senior Full-Stack & AI Architect",
    description:
      "Engineer at the intersection of architecture, AI, and infrastructure.",
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
