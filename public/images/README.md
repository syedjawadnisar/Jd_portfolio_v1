# Image slots

Every slot below is optional. The site is designed to look finished with **zero**
files in this folder — components fall back to procedural visuals. Dropping a file
in is a one-line change in the corresponding data file.

## Project stills — `public/images/projects/`

| File            | Project   | Wire it up in                                     |
| --------------- | --------- | ------------------------------------------------- |
| `toptal.webp`   | Toptal    | `data/projects.ts` → `image: "/images/projects/toptal.webp"` |
| `cellcloud.webp`| CellCloud | `data/projects.ts` → `image: "/images/projects/cellcloud.webp"` |
| `moemate.webp`  | Moemate   | `data/projects.ts` → `image: "/images/projects/moemate.webp"` |
| `chiirp.webp`   | CHIIRP    | `data/projects.ts` → `image: "/images/projects/chiirp.webp"` |
| `docuseal.webp` | Docuseal  | `data/projects.ts` → `image: "/images/projects/docuseal.webp"` |

- **Dimensions:** 1600 × 1000 (16:10). The card crops with `object-cover`, so keep
  the subject away from the outer 8% on every edge.
- **Format:** `.webp` preferred (AVIF acceptable). Target under 300 KB each.
- **Tone:** dark, low-key, indigo-black base with warm-gold highlights so the still
  sits inside the palette instead of punching a hole in it. Avoid pure white fields
  and avoid legible third-party logos or UI chrome.
- **Always set `imageAlt` alongside `image`.** Describe the frame, not the company.
- **Optional `accent`:** a hex string per project tints the frame glow and the
  fallback field. Omit it to inherit the global `--color-accent` token.

### Adding one

```ts
// data/projects.ts
{
  name: "Toptal",
  // ...
  image: "/images/projects/toptal.webp",
  imageAlt: "Abstract ledger lines resolving into a single approved row",
  accent: "#f0b23c", // optional
}
```

Never point `image` at a file that is not committed here — `next/image` will 404
at runtime. Leaving the field undefined is always the safe state.

## Open Graph — `public/images/`

| File        | Used for                          | Dimensions |
| ----------- | --------------------------------- | ---------- |
| `og.png`    | Site-wide social preview card      | 1200 × 630 |

Not yet wired into metadata; add it to the route's `metadata.openGraph.images`
when the file lands.
