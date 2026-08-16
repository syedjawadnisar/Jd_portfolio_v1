"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
  type RefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { EASE_OUT } from "@/lib/motion";
import { Level } from "./Level";
import { Player } from "./Player";
import type { StageDef } from "./stages";
import {
  keyboardMap,
  TouchControls,
  type PlayerTracker,
  type TouchState,
} from "./controls";

const FINISH_DELAY_MS = 650;

function CameraRig({ tracker }: { tracker: RefObject<PlayerTracker> }) {
  useFrame(({ camera }, delta) => {
    const p = tracker.current;
    const blend = 1 - Math.pow(0.002, delta);
    // Slight look-ahead in the travel direction, gentle lift on high jumps.
    const targetX = p.x + THREE.MathUtils.clamp(p.vx * 0.32, -1.8, 1.8) + 1;
    const targetY = 2.1 + Math.max(0, p.y - 2.4) * 0.45;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, blend);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, blend);
    camera.position.z = 9.5;
    camera.lookAt(camera.position.x, 1.35, 0);
  });
  return null;
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 21 V4 M6 4 h11 l-3 3.5 3 3.5 H6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type RespawnFlashHandle = { trigger: () => void };

/**
 * Owns the respawn-fade state so a fall never re-renders <Physics>, <Level>
 * or <Player> — the simulation tree stays mounted and untouched.
 */
function RespawnFlash({ ref }: { ref: Ref<RespawnFlashHandle> }) {
  const [flash, setFlash] = useState(0);

  useImperativeHandle(ref, () => ({ trigger: () => setFlash((f) => f + 1) }), []);

  return (
    <AnimatePresence>
      {flash > 0 && (
        <motion.div
          key={flash}
          className="pointer-events-none absolute inset-0 z-30 bg-[--color-bg]"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
}

type PlatformerProps = {
  stage: StageDef;
  onFinish: () => void;
  /** Raised when the canvas loses its WebGL context — the parent swaps in the fallback. */
  onContextLost: () => void;
};

export function Platformer({ stage, onFinish, onContextLost }: PlatformerProps) {
  const { layout, theme } = stage;
  const touch = useRef<TouchState>({ left: false, right: false, jump: false });
  const tracker = useRef<PlayerTracker>({ x: 0, y: 1.6, vx: 0 });
  const progress = useMotionValue(0);
  const finished = useRef(false);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flash = useRef<RespawnFlashHandle>(null);
  const [paused, setPaused] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  // Pause the simulation when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Hybrid devices (touchscreen laptops) answer yes to both: they get the
  // thumb cluster *and* the keyboard hint, rather than one at the other's cost.
  useEffect(() => {
    setCoarsePointer(
      window.matchMedia("(pointer: coarse)").matches ||
        navigator.maxTouchPoints > 0,
    );
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
    return () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, []);

  const handleFinish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    finishTimer.current = setTimeout(onFinish, FINISH_DELAY_MS);
  }, [onFinish]);

  /** The escape hatch: leave the course without clearing it. */
  const skipCourse = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinish();
  }, [onFinish]);

  const handleRespawn = useCallback(() => flash.current?.trigger(), []);

  const handleContextLost = useCallback(
    (e: Event) => {
      e.preventDefault();
      onContextLost();
    },
    [onContextLost],
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          camera={{ position: [1, 2.1, 9.5], fov: 50 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) =>
            gl.domElement.addEventListener("webglcontextlost", handleContextLost, {
              once: true,
            })
          }
        >
          <fog attach="fog" args={[theme.fog, 20, 55]} />
          <ambientLight intensity={0.65} />
          <directionalLight position={[6, 10, 6]} intensity={1.3} color={theme.light} />
          <Suspense fallback={null}>
            <Physics gravity={[0, -22, 0]} paused={paused}>
              <Level layout={layout} theme={theme} onFinish={handleFinish} />
              <Player
                touch={touch}
                tracker={tracker}
                progress={progress}
                finishX={layout.finishX}
                onRespawn={handleRespawn}
              />
            </Physics>
          </Suspense>
          <CameraRig tracker={tracker} />
        </Canvas>
      </KeyboardControls>

      {/* Leaving the course is always one click away — no infinite respawn trap. */}
      <button
        type="button"
        onClick={skipCourse}
        data-cursor="hover"
        className="absolute left-6 top-14 z-20 text-[11px] uppercase tracking-[0.3em] text-[--color-fg-muted] underline decoration-[--color-border] underline-offset-4 transition-colors hover:text-[--stage-accent] hover:decoration-[--stage-accent]"
      >
        skip the course
      </button>

      {/* Objective */}
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 px-6 text-center">
        <motion.h1
          className="font-display text-3xl italic tracking-tight md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE_OUT }}
        >
          {stage.course.title}
        </motion.h1>
        <motion.p
          className="mt-2 text-xs uppercase tracking-[0.25em] text-[--color-fg-muted]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {stage.course.subtitle}
        </motion.p>
      </div>

      {coarsePointer && <TouchControls touch={touch} />}

      {/* Keys hint for keyboard users */}
      {finePointer && (
        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-14 z-10 text-center text-[11px] uppercase tracking-[0.25em] text-[--color-fg-muted]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          ← → move&ensp;·&ensp;space jump
        </motion.p>
      )}

      {/* Progress bar — start marker to flag */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[--color-fg-muted]" />
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[--color-border]">
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[--stage-accent]"
              style={{ scaleX: progress }}
            />
          </div>
          <span className="shrink-0 text-[--stage-accent]">
            <FlagIcon />
          </span>
        </div>
      </div>

      {/* Soft fade on respawn */}
      <RespawnFlash ref={flash} />
    </div>
  );
}
