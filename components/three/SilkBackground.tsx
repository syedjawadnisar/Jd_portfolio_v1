"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { canvasDpr, useCoarsePointer, usePrefersReducedMotion } from "@/lib/motion";

export type SilkVariant = "calm" | "deep" | "energetic";

type SilkPreset = {
  /** Time accumulation rate — kept in the 0.02–0.05 band for a slow, peaceful drift. */
  speed: number;
  /** How strongly the color layers rise over the base indigo. */
  intensity: number;
  /** Band sharpness — higher = more defined silk folds. */
  contrast: number;
  /**
   * fbm octaves. Every octave is a simplex evaluation in five separate fbm
   * calls, so this is the single biggest lever on fragment cost. Only the
   * full-screen-hero variant pays for the fourth.
   */
  octaves: number;
};

const PRESETS: Record<SilkVariant, SilkPreset> = {
  calm: { speed: 0.032, intensity: 0.55, contrast: 1.2, octaves: 3 },
  deep: { speed: 0.026, intensity: 0.72, contrast: 1.5, octaves: 3 },
  energetic: { speed: 0.05, intensity: 0.9, contrast: 1.75, octaves: 4 },
};

// Raw sRGB components — bypasses THREE.Color's sRGB→linear conversion so the
// shader (which writes straight to the drawing buffer) shows the intended hues.
const rgb = (hex: number) =>
  new THREE.Vector3(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  );

const BASE = 0x0c0d18; // deep indigo-black, tuned to --color-bg
const ACCENT = 0xe8b464; // warm gold — --color-accent family
const ACCENT_2 = 0x5d76b5; // faint cool blue counter-current

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  // Fullscreen quad in clip space — camera-independent, sits at the far plane.
  gl_Position = vec4(position.xy, 1.0, 1.0);
}
`;

const fragmentShaderBody = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uPointer;
uniform float uAspect;
uniform float uIntensity;
uniform float uContrast;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform vec3 uAccent2;

varying vec2 vUv;

// Simplex 2D noise (Ashima / Ian McEwan, public domain)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < OCTAVES; i++) {
    v += a * snoise(p);
    p = rot * p * 2.03 + vec2(7.3, 3.1);
    a *= 0.52;
  }
  return v;
}

void main() {
  vec2 st = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
  vec2 p = st * 1.35 + uPointer * 0.08;
  float t = uTime;

  // Domain-warped silk: q warps p, r warps q — layered currents.
  vec2 q = vec2(
    fbm(p + vec2(0.00, 0.62) * t),
    fbm(p + vec2(5.20, 1.30) - vec2(0.44, 0.30) * t)
  );
  vec2 r = vec2(
    fbm(p + 1.6 * q + vec2(1.7, 9.2) + vec2(0.31, 0.21) * t),
    fbm(p + 1.6 * q + vec2(8.3, 2.8) - vec2(0.18, 0.26) * t)
  );
  float f = fbm(p + 1.8 * r);
  float lum = f * 0.5 + 0.5;

  // Warm gold layer — broad sheets shaped by the warp magnitude.
  float gold = smoothstep(0.32, 0.92, lum + dot(q, q) * 0.22);
  gold = pow(gold, uContrast);

  // Cool counter-current — recombines the second warp field instead of
  // evaluating a sixth fbm; the signed mix decorrelates it from the gold.
  float c = dot(r, vec2(0.62, -0.48));
  float blue = pow(smoothstep(0.42, 0.95, c * 0.5 + 0.5), uContrast * 1.1);

  vec3 col = uBase;
  col = mix(col, uAccent2, blue * 0.30 * uIntensity);
  col = mix(col, uAccent, gold * 0.52 * uIntensity);

  // Specular sheen on the brightest folds.
  float sheen = smoothstep(0.72, 1.0, lum * gold);
  col += uAccent * sheen * 0.20 * uIntensity;

  // Vignette — settle toward base at the edges so foreground copy stays readable.
  float vig = 1.0 - smoothstep(0.30, 1.15, length(st));
  col = mix(uBase * 0.6, col, vig);

  // Film-grain dither to prevent banding in the slow gradients.
  float grain = fract(sin(dot(gl_FragCoord.xy + t * 120.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** GLSL ES 1.0 needs a constant loop bound — the octave count is a #define. */
const fragmentShaderFor = (octaves: number) =>
  `#define OCTAVES ${octaves}\n${fragmentShaderBody}`;

/**
 * Fullscreen silk shader quad — drop inside ANY existing R3F Canvas.
 * Camera-independent (clip-space quad), draws first (renderOrder -1,
 * no depth test) so everything else in the scene layers on top.
 */
export function SilkPlane({ variant = "calm" }: { variant?: SilkVariant }) {
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const timeRef = useRef(40); // start mid-flow, not at the noise origin
  const pointerTarget = useMemo(() => new THREE.Vector2(), []);

  const material = useMemo(() => {
    const preset = PRESETS[variant];
    // The octave count was device-independent, so /cinematic ran the 4-octave
    // preset on phones: five fbm calls x four octaves = twenty simplex
    // evaluations per pixel per frame. Coarse pointers drop one octave — the
    // fold structure survives, the thermal budget does too.
    const octaves = coarse
      ? Math.max(2, preset.octaves - 1)
      : preset.octaves;
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaderFor(octaves),
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uAspect: { value: 1 },
        uIntensity: { value: preset.intensity },
        uContrast: { value: preset.contrast },
        uBase: { value: rgb(BASE) },
        uAccent: { value: rgb(ACCENT) },
        uAccent2: { value: rgb(ACCENT_2) },
      },
    });
  }, [variant, coarse]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    // Clamp delta (tab refocus spikes); reduced motion = near-static slow crawl.
    const dt = Math.min(delta, 0.1) * PRESETS[variant].speed;
    timeRef.current += reduced ? dt * 0.08 : dt;
    u.uTime.value = timeRef.current;
    u.uAspect.value = state.size.width / state.size.height;
    pointerTarget.set(
      reduced ? 0 : state.pointer.x,
      reduced ? 0 : state.pointer.y,
    );
    (u.uPointer.value as THREE.Vector2).lerp(pointerTarget, 0.04);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

type SilkBackgroundProps = {
  variant?: SilkVariant;
  className?: string;
};

/**
 * Standalone silk/aurora background — owns its Canvas.
 * Positioned absolute inset-0 -z-20 by default; override via className.
 */
export function SilkBackground({
  variant = "calm",
  className,
}: SilkBackgroundProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const [visible, setVisible] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  // The deck sits above a full-height footer. Once it scrolls away there is
  // no reason to keep shading a fragment-heavy full-screen quad; SilkPlane
  // accumulates its own clock, so resuming is seamless.
  useEffect(() => {
    const el = wrapper.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Decorative surface: a lost context drops it rather than leaving a
  // permanently black rectangle over the page background.
  if (contextLost) return null;

  return (
    <div
      ref={wrapper}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-20", className)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={canvasDpr(coarse)}
        frameloop={visible ? "always" : "never"}
        gl={{
          // The quad needs no AA — it is a single full-screen triangle pair.
          antialias: false,
          alpha: false,
          // Decorative surface: asking for the discrete GPU costs battery and
          // heat for a backdrop.
          powerPreference: "default",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            () => setContextLost(true),
            { once: true },
          );
        }}
      >
        <Suspense fallback={null}>
          <SilkPlane variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  );
}
