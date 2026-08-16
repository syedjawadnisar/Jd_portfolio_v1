"use client";

import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { LevelLayout, StageTheme } from "./stages";

/** Launch velocity from a bounce pad — apex ~5.1 with gravity 22. */
const PAD_LAUNCH_VELOCITY = 15;
const PAD_HEIGHT = 0.24;
/** Clamp per-frame time so sine-driven bodies don't leap after a hidden tab. */
const MAX_STEP = 0.05;

function FinishFlag({
  x,
  theme,
  reduced,
  onFinish,
}: {
  x: number;
  theme: StageTheme;
  reduced: boolean;
  onFinish: () => void;
}) {
  const cloth = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cloth.current || reduced) return;
    cloth.current.rotation.y = Math.sin(clock.elapsedTime * 2.1) * 0.22;
  });

  return (
    <group position={[x, 0, 0]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[0.5, 1.5, 1.2]}
          position={[0, 1.5, 0]}
          sensor
          onIntersectionEnter={onFinish}
        />
      </RigidBody>

      {/* Pole */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 2.6, 10]} />
        <meshStandardMaterial color="#8b8b9a" roughness={0.5} />
      </mesh>
      {/* Cloth — pivot at the pole so it sways */}
      <group ref={cloth} position={[0, 2.28, 0]}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.95, 0.55, 0.04]} />
          <meshStandardMaterial
            color={theme.accent}
            emissive={theme.accent}
            emissiveIntensity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* Base marker */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.42, 0.1, 16]} />
        <meshStandardMaterial color={theme.block} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Kinematic lift oscillating vertically on a sine — the player rides it. */
function Mover({
  def,
  theme,
}: {
  def: NonNullable<LevelLayout["movers"]>[number];
  theme: StageTheme;
}) {
  const body = useRef<RapierRigidBody>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += Math.min(delta, MAX_STEP);
    const y =
      def.baseY +
      def.amp * Math.sin((Math.PI * 2 * time.current) / def.period + (def.phase ?? 0));
    body.current?.setNextKinematicTranslation({ x: def.cx, y, z: 0 });
  });

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders="cuboid"
      position={[def.cx, def.baseY, 0]}
    >
      <mesh>
        <boxGeometry args={[def.w, 0.4, 2.6]} />
        <meshStandardMaterial color={theme.block} roughness={0.8} />
      </mesh>
      {/* Accent top so the lift reads as "the moving thing" */}
      <mesh position={[0, 0.215, 0]}>
        <boxGeometry args={[def.w, 0.05, 2.6]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.35}
        />
      </mesh>
    </RigidBody>
  );
}

/** Kinematic sphere patrolling fromX..toX — pushes the player, forces timing. */
function Roller({
  def,
  theme,
}: {
  def: NonNullable<LevelLayout["rollers"]>[number];
  theme: StageTheme;
}) {
  const body = useRef<RapierRigidBody>(null);
  const time = useRef(0);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const euler = useMemo(() => new THREE.Euler(), []);
  const mid = (def.fromX + def.toX) / 2;
  const amp = (def.toX - def.fromX) / 2;

  useFrame((_, delta) => {
    time.current += Math.min(delta, MAX_STEP);
    const x = mid + amp * Math.sin((Math.PI * 2 * time.current) / def.period);
    body.current?.setNextKinematicTranslation({ x, y: def.r, z: 0 });
    // Roll visually in sync with travel.
    euler.set(0, 0, -(x - def.fromX) / def.r);
    quat.setFromEuler(euler);
    body.current?.setNextKinematicRotation(quat);
  });

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[mid, def.r, 0]}
    >
      <BallCollider args={[def.r]} />
      <mesh>
        <sphereGeometry args={[def.r, 24, 24]} />
        <meshStandardMaterial color={theme.hazard} roughness={0.35} />
      </mesh>
      {/* Contrast band makes the roll legible */}
      <mesh>
        <torusGeometry args={[def.r * 0.99, 0.06, 8, 32]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.3}
        />
      </mesh>
    </RigidBody>
  );
}

/** Contact launches the player upward — required to clear the stage-3 wall. */
function BouncePad({
  def,
  theme,
}: {
  def: NonNullable<LevelLayout["pads"]>[number];
  theme: StageTheme;
}) {
  const visual = useRef<THREE.Group>(null);
  const hitAt = useRef(-1);

  const onHit = useCallback((payload: CollisionEnterPayload) => {
    const other = payload.other.rigidBody;
    if (!other) return;
    const v = other.linvel();
    other.setLinvel({ x: v.x, y: PAD_LAUNCH_VELOCITY, z: 0 }, true);
    hitAt.current = 0;
  }, []);

  // Quick squash on launch — gameplay feedback, driven by the player's action.
  useFrame((_, delta) => {
    if (!visual.current || hitAt.current < 0) return;
    hitAt.current += Math.min(delta, MAX_STEP);
    const t = hitAt.current;
    if (t >= 0.3) {
      visual.current.scale.y = 1;
      hitAt.current = -1;
      return;
    }
    visual.current.scale.y = 1 - Math.sin((t / 0.3) * Math.PI) * 0.4;
  });

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[def.cx, PAD_HEIGHT / 2, 0]}
      onCollisionEnter={onHit}
    >
      <CuboidCollider args={[0.85, PAD_HEIGHT / 2, 1.2]} />
      <group ref={visual}>
        <mesh>
          <cylinderGeometry args={[0.8, 0.92, PAD_HEIGHT, 24]} />
          <meshStandardMaterial color={theme.block} roughness={0.6} />
        </mesh>
        <mesh position={[0, PAD_HEIGHT / 2 - 0.02, 0]}>
          <torusGeometry args={[0.62, 0.06, 8, 32]} />
          <meshStandardMaterial
            color={theme.accent}
            emissive={theme.accent}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}

/**
 * Static parallax dressing. Hoisted to module scope so a respawn re-render
 * never rebuilds the geometry elements; only the theme color is looked up
 * per render.
 */
const BACKGROUND_SHAPES: {
  pos: [number, number, number];
  geo: ReactNode;
  tint: "accent" | "wire";
  opacity: number;
  float: { speed: number; rot: number; lift: number };
}[] = [
  {
    pos: [8, 3.4, -7],
    geo: <icosahedronGeometry args={[0.9, 0]} />,
    tint: "accent",
    opacity: 0.18,
    float: { speed: 1.3, rot: 0.5, lift: 0.8 },
  },
  {
    pos: [19, 4.2, -9],
    geo: <octahedronGeometry args={[0.8, 0]} />,
    tint: "wire",
    opacity: 0.14,
    float: { speed: 1.7, rot: 0.4, lift: 0.6 },
  },
  {
    pos: [30, 3, -8],
    geo: <torusGeometry args={[0.7, 0.18, 10, 36]} />,
    tint: "accent",
    opacity: 0.16,
    float: { speed: 1.1, rot: 0.3, lift: 0.5 },
  },
];

function BackgroundShapes({
  theme,
  reduced,
}: {
  theme: StageTheme;
  reduced: boolean;
}) {
  return (
    <group>
      {BACKGROUND_SHAPES.map((s, i) => {
        const mesh = (
          <mesh position={s.pos}>
            {s.geo}
            <meshBasicMaterial
              color={theme[s.tint]}
              wireframe
              transparent
              opacity={s.opacity}
            />
          </mesh>
        );
        return reduced ? (
          <group key={i}>{mesh}</group>
        ) : (
          <Float
            key={i}
            speed={s.float.speed}
            rotationIntensity={s.float.rot}
            floatIntensity={s.float.lift}
          >
            {mesh}
          </Float>
        );
      })}
    </group>
  );
}

export function Level({
  layout,
  theme,
  onFinish,
}: {
  layout: LevelLayout;
  theme: StageTheme;
  onFinish: () => void;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <group>
      {/* Ground strips (gaps between them are the drop hazards) */}
      {layout.grounds.map((g, i) => {
        const top = g.top ?? 0;
        const h = top + 1; // extend down to y = -1 so plateaus read as solid
        return (
          <RigidBody key={`ground-${i}`} type="fixed" colliders="cuboid">
            <mesh position={[g.cx, top - h / 2, 0]}>
              <boxGeometry args={[g.w, h, 3]} />
              <meshStandardMaterial color={theme.ground} roughness={0.9} />
            </mesh>
          </RigidBody>
        );
      })}
      {/* Accent edge lines along ground tops — decorative only */}
      {layout.grounds.map((g, i) => (
        <mesh key={`edge-${i}`} position={[g.cx, (g.top ?? 0) + 0.005, 1.28]}>
          <boxGeometry args={[g.w, 0.03, 0.05]} />
          <meshBasicMaterial color={theme.accent} transparent opacity={0.45} />
        </mesh>
      ))}

      {/* Fixed obstacles + floating ledges */}
      {layout.blocks.map((b, i) => (
        <RigidBody
          key={`block-${i}`}
          type="fixed"
          colliders="cuboid"
          position={[b.cx, b.cy, 0]}
          rotation={[0, 0, b.rot ?? 0]}
        >
          <mesh>
            <boxGeometry args={[b.w, b.h, 2.4]} />
            <meshStandardMaterial color={theme.block} roughness={0.85} />
          </mesh>
          {/* thin accent cap */}
          <mesh position={[0, b.h / 2 + 0.015, 0]}>
            <boxGeometry args={[b.w, 0.03, 2.4]} />
            <meshBasicMaterial color={theme.accent} transparent opacity={0.35} />
          </mesh>
        </RigidBody>
      ))}

      {layout.movers?.map((m, i) => (
        <Mover key={`mover-${i}`} def={m} theme={theme} />
      ))}
      {layout.rollers?.map((r, i) => (
        <Roller key={`roller-${i}`} def={r} theme={theme} />
      ))}
      {layout.pads?.map((p, i) => (
        <BouncePad key={`pad-${i}`} def={p} theme={theme} />
      ))}

      <FinishFlag x={layout.finishX} theme={theme} reduced={reduced} onFinish={onFinish} />
      <BackgroundShapes theme={theme} reduced={reduced} />
    </group>
  );
}
