import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";
import { bio } from "@/data/bio";
import { siteUrl } from "@/lib/site";
import { isIndexableOrigin } from "./robots";
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

/**
 * Site-wide metadata. The name suffix lives here and nowhere else: every route
 * declares its own bare title and `title.template` appends the brand, so the
 * name can never be doubled in a <title> or drift between routes.
 *
 * `openGraph` here is a default for any route that does not declare one — a
 * child segment's openGraph REPLACES the parent's rather than merging, so the
 * three content routes each carry the full set themselves.
 */
export const metadata: Metadata = {
  title: {
    default: `${bio.name} — ${bio.title}`,
    template: `%s — ${bio.name}`,
  },
  description:
    "Engineer at the intersection of architecture, AI, and infrastructure. I build the systems other teams talk about.",
  metadataBase: new URL(siteUrl),
  applicationName: bio.name,
  authors: [{ name: bio.name, url: siteUrl }],
  creator: bio.name,
  publisher: bio.name,
  // Preview and localhost builds get a page-level noindex on top of the
  // disallow-all in robots.txt: robots.txt stops the crawl, the header/meta
  // stops the URL being indexed from an inbound link.
  robots: isIndexableOrigin()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: `${bio.name} — ${bio.title}`,
    description:
      "Engineer at the intersection of architecture, AI, and infrastructure.",
    url: siteUrl,
    siteName: bio.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${bio.name} — ${bio.title}`,
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
