"use client";

import Image from "next/image";

type ProjectVisualProps = {
  name: string;
  /** Path under /public. When absent, a procedural field is drawn instead. */
  image?: string;
  imageAlt?: string;
  /** Hex tint. Defaults to the global accent token. */
  accent?: string;
  /** Set on the first row so the above-the-fold still is not lazy-loaded. */
  priority?: boolean;
};

/** Stable small integer from a string — same project always gets the same glyph. */
function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * "CellCloud" -> "CC", "Docuseal" -> "D", "CHIIRP" -> "C".
 * Two letters only when the name genuinely camel-cases; all-caps names keep one.
 */
function monogram(name: string) {
  const letters = name.replace(/[^A-Za-z]/g, "");
  const isAllCaps = letters === letters.toUpperCase();
  const caps = letters.match(/[A-Z]/g) ?? [];
  if (!isAllCaps && caps.length >= 2) return caps.slice(0, 2).join("");
  return (letters.charAt(0) || name.charAt(0)).toUpperCase();
}

/** Five line-art fields, chosen deterministically per project. */
function Glyph({ variant }: { variant: number }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {variant === 0 &&
        [26, 46, 66, 86, 106].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} {...common} />
        ))}

      {variant === 1 && (
        <>
          {[20, 60, 100, 140, 180].map((x) => (
            <line key={`v${x}`} x1={x} y1="-20" x2={x} y2="220" {...common} />
          ))}
          {[20, 60, 100, 140, 180].map((y) => (
            <line key={`h${y}`} x1="-20" y1={y} x2="220" y2={y} {...common} />
          ))}
        </>
      )}

      {variant === 2 &&
        [-120, -80, -40, 0, 40, 80, 120, 160, 200].map((o) => (
          <line key={o} x1={o} y1="-20" x2={o + 220} y2="220" {...common} />
        ))}

      {variant === 3 &&
        [40, 66, 92, 118, 144].map((r) => (
          <path
            key={r}
            d={`M ${200 - r} 200 A ${r} ${r} 0 0 0 200 ${200 - r}`}
            {...common}
          />
        ))}

      {variant === 4 &&
        [0, 15, 30, 45].map((a, i) => (
          <rect
            key={a}
            x={100 - (78 - i * 14)}
            y={100 - (78 - i * 14)}
            width={(78 - i * 14) * 2}
            height={(78 - i * 14) * 2}
            transform={`rotate(${a} 100 100)`}
            {...common}
          />
        ))}
    </svg>
  );
}

export function ProjectVisual({
  name,
  image,
  imageAlt,
  accent,
  priority = false,
}: ProjectVisualProps) {
  const tint = accent ?? "var(--color-accent)";
  const variant = hash(name) % 5;

  return (
    <div className="group/visual relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-bg-elevated) sm:rounded-3xl">
      {image ? (
        <Image
          src={image}
          alt={imageAlt ?? `${name} — project still`}
          fill
          sizes="(min-width: 1024px) 46vw, (min-width: 640px) 88vw, 92vw"
          priority={priority}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/visual:scale-[1.03]"
        />
      ) : (
        <div aria-hidden className="absolute inset-0">
          {/* Base field — bg token warmed toward the project tint. */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(148deg, color-mix(in oklch, ${tint} 12%, var(--color-bg-elevated)) 0%, var(--color-bg) 72%)`,
            }}
          />

          {/* Directional glow. */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 95% at 18% 12%, color-mix(in oklch, ${tint} 24%, transparent), transparent 60%)`,
            }}
          />

          {/* Fine rule texture, barely there. */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, color-mix(in oklch, var(--color-fg) 5%, transparent) 0 1px, transparent 1px 7px)",
            }}
          />

          {/* Line-art glyph, anchored right so the monogram stays legible. */}
          <div
            className="absolute -right-[12%] top-1/2 h-[150%] w-[62%] -translate-y-1/2"
            style={{ color: `color-mix(in oklch, ${tint} 30%, transparent)` }}
          >
            <Glyph variant={variant} />
          </div>

          {/* Ghosted monogram. */}
          <span
            className="absolute bottom-[-0.14em] left-[0.06em] select-none font-display text-[9.5rem] italic leading-none sm:text-[12rem]"
            style={{
              color: `color-mix(in oklch, ${tint} 22%, transparent)`,
            }}
          >
            {monogram(name)}
          </span>

          {/* Top sheen so the frame reads as glass, not a flat swatch. */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-(--color-fg)/[0.06] to-transparent" />
        </div>
      )}

      {/* Inner hairline, shared by both states. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-(--color-fg)/[0.07] sm:rounded-3xl"
      />
    </div>
  );
}
