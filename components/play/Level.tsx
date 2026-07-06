"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

/**
 * Side-view level described as data so reruns can remix the layout.
 * Ground tops sit at y = 0. Everything lives on the z = 0 plane.
 */
export type LevelLayout = {
  finishX: number;
  /** Ground strips: center x + width. Space between strips = a gap obstacle. */
  grounds: { cx: number; w: number }[];
  /** Fixed cuboid obstacles: center x/y, width, height, optional z-rotation (ramp). */
  blocks: { cx: number; cy: number; w: number; h: number; rot?: number }[];
};

export const layouts: LevelLayout[] = [
  {
    // Run 1 — box, ramp, gap, pillar
    finishX: 33,
    grounds: [
      { cx: 4.5, w: 21 }, // -6 .. 15
      { cx: 29.5, w: 22 }, // 18.5 .. 40.5
    ],
    blocks: [
      { cx: 6, cy: 0.55, w: 1.1, h: 1.1 }, // crate
      { cx: 10.8, cy: 0.28, w: 3.2, h: 0.4, rot: 0.3 }, // ramp
      { cx: 25, cy: 0.75, w: 1.2, h: 1.5 }, // pillar
    ],
  },
  {
    // Run 2 remix — pillar, gap, stair pair, crate
    finishX: 31.5,
    grounds: [
      { cx: 2, w: 16 }, // -6 .. 10
      { cx: 26.8, w: 27 }, // 13.3 .. 40.3
    ],
    blocks: [
      { cx: 5, cy: 0.7, w: 1.1, h: 1.4 }, // pillar
      { cx: 18, cy: 0.4, w: 1.4, h: 0.8 }, // stair low
      { cx: 19.4, cy: 0.7, w: 1.4, h: 1.4 }, // stair high
      { cx: 25.5, cy: 0.55, w: 1.2, h: 1.1 }, // crate
    ],
  },
];

const GROUND_COLOR = "#20202b";
const BLOCK_COLOR = "#2e2e3d";
const ACCENT = "#e8b464";

function FinishFlag({ x, onFinish }: { x: number; onFinish: () => void }) {
  const cloth = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cloth.current) return;
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
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* Base marker */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.35, 0.42, 0.1, 16]} />
        <meshStandardMaterial color={BLOCK_COLOR} roughness={0.8} />
      </mesh>
    </group>
  );
}

function BackgroundShapes() {
  return (
    <group>
      <Float speed={1.3} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[8, 3.4, -7]}>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.18} />
        </mesh>
      </Float>
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[19, 4.2, -9]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial color="#a8c8ff" wireframe transparent opacity={0.14} />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[30, 3, -8]}>
          <torusGeometry args={[0.7, 0.18, 10, 36]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.16} />
        </mesh>
      </Float>
    </group>
  );
}

export function Level({
  layout,
  onFinish,
}: {
  layout: LevelLayout;
  onFinish: () => void;
}) {
  return (
    <group>
      {/* Ground strips (gap between them is the drop hazard) */}
      {layout.grounds.map((g, i) => (
        <RigidBody key={`ground-${i}`} type="fixed" colliders="cuboid">
          <mesh position={[g.cx, -0.5, 0]}>
            <boxGeometry args={[g.w, 1, 3]} />
            <meshStandardMaterial color={GROUND_COLOR} roughness={0.9} />
          </mesh>
        </RigidBody>
      ))}
      {/* Accent edge lines along ground tops — decorative only */}
      {layout.grounds.map((g, i) => (
        <mesh key={`edge-${i}`} position={[g.cx, 0.005, 1.28]}>
          <boxGeometry args={[g.w, 0.03, 0.05]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.45} />
        </mesh>
      ))}

      {/* Obstacles */}
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
            <meshStandardMaterial color={BLOCK_COLOR} roughness={0.85} />
          </mesh>
          {/* thin accent cap */}
          <mesh position={[0, b.h / 2 + 0.015, 0]}>
            <boxGeometry args={[b.w, 0.03, 2.4]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
          </mesh>
        </RigidBody>
      ))}

      <FinishFlag x={layout.finishX} onFinish={onFinish} />
      <BackgroundShapes />
    </group>
  );
}
