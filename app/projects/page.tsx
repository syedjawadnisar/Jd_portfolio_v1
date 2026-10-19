import type { Metadata } from "next";
import { JourneyFooter } from "@/components/footer/JourneyFooter";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { bio } from "@/data/bio";
import { siteUrl } from "@/lib/site";

// Bare title, the root layout's title.template appends the name.
const title = "All Projects";
const ogTitle = `${title} — ${bio.name}`;
const description =
  "Every project in one place: what was built, where, and on what stack, from a GovCloud SaaS to AI agents.";
const url = new URL("/projects", siteUrl).toString();

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title: ogTitle,
    description,
    url,
    siteName: bio.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: ogTitle, description },
};

export default function ProjectsPage() {
  return (
    <main className="relative projects-tree">
      {/* Without JS every reveal stays at its inline `initial` state and the
          cards never appear. Same neutraliser as the landing, scoped here. */}
      <noscript>
        <style>{`.projects-tree [style*="opacity:0"],.projects-tree [style*="translate"],.projects-tree [style*="blur("]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
      </noscript>
      <ProjectsIndex />
      <JourneyFooter />
    </main>
  );
}
