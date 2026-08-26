"use client";

import { useEffect, useState } from "react";

/**
 * WebGL capability probe, shared by every surface that mounts a Canvas.
 *
 * Three surfaces render WebGL and all three must answer the same question
 * before they pull three.js over the wire: the landing's scroll scene, the
 * cinematic deck's silk backdrop, and the platformer. A device with no WebGL
 * — an old phone, a VM with no GPU passthrough, a locked-down corporate
 * machine with the driver blocklisted — otherwise downloads the renderer and
 * paints nothing.
 *
 * Probing means creating a throwaway context. Contexts are a scarce resource
 * (browsers cap them per document, oldest evicted), so the probe canvas is
 * never attached and never retained: it is garbage the moment the boolean is
 * read. `getContext` can also throw outright rather than return null on some
 * builds, hence the try.
 */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * `null` until the probe has run, then the verdict.
 *
 * The probe deliberately lives in an effect rather than a lazy `useState`
 * initializer: this hook is called from components that render on the server,
 * where `document` does not exist, and a client-only initializer would make
 * the first client render disagree with the server HTML. `null` is the honest
 * shared answer for both — callers render their non-WebGL layer for it, which
 * is what the server emitted anyway.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  return supported;
}
