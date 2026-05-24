import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
