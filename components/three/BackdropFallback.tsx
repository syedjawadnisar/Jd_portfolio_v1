import { cn } from "@/lib/utils";

/**
 * The static stand-in for a shader backdrop.
 *
 * Both WebGL backdrops on this site are decorative: the type, the layout and
 * every control read exactly the same without them. So the no-WebGL path is
 * not an error screen — it is this. A three-stop field derived from the same
 * tokens the shader samples (indigo base, warm gold high on the left, a cool
 * counter-current low on the right), so a machine with no GPU gets a quiet
 * version of the same picture instead of a flat rectangle.
 *
 * It also renders *underneath* the canvas whenever WebGL is available: both
 * canvases are `alpha: false` and cover it completely, so it costs one opaque
 * paint and buys a floor for the two moments the canvas is not there yet or
 * no longer there — the dynamic chunk still in flight, and a lost context
 * (both of those tear the canvas down to `null`).
 *
 * No hooks and no directive of its own: one div and a gradient, so it renders
 * on the server as part of whichever tree imports it and is already painted in
 * the prerendered HTML before a line of JavaScript runs.
 */
export function BackdropFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{
        background: [
          "radial-gradient(ellipse 80% 62% at 18% 12%, color-mix(in oklch, var(--color-accent) 13%, transparent), transparent 64%)",
          "radial-gradient(ellipse 70% 58% at 86% 84%, color-mix(in oklch, var(--color-accent-soft) 8%, transparent), transparent 62%)",
          "radial-gradient(ellipse 96% 74% at 50% 46%, color-mix(in oklch, var(--color-bg-elevated) 72%, transparent), transparent 72%)",
          "var(--color-bg)",
        ].join(", "),
      }}
    />
  );
}
