import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";
import { siteUrl } from "@/lib/site";
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
 * The browser chrome is part of the first frame: without a theme color, iOS
 * Safari and Chrome on Android frame a near-black page in their default light
 * UI. The hex matches --color-bg and the shader's BASE constant.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0d18",
  colorScheme: "dark",
};

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
