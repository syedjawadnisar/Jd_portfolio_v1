"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  CapsuleCollider,
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import type { ControlName, PlayerTracker, TouchState } from "./controls";

const MOVE_SPEED = 6;
const JUMP_VELOCITY = 9.6;
const SPAWN = { x: 0, y: 1.6, z: 0 };
const KILL_Y = -9;
const JUMP_COOLDOWN = 0.25;
/** capsule half-height (0.15) + radius (0.35) + grounded tolerance */
const GROUND_RAY_LENGTH = 0.62;

const BODY_COLOR = "#e5a94e";
const EYE_WHITE = "#fbfbfd";
const PUPIL = "#191921";

type PlayerProps = {
  touch: RefObject<TouchState>;
  tracker: RefObject<PlayerTracker>;
  progress: MotionValue<number>;
  finishX: number;
  onRespawn: () => void;
};

export function Player({ touch, tracker, progress, finishX, onRespawn }: PlayerProps) {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const facing = useRef(1);
  const lastJump = useRef(-1);
  const { rapier, world } = useRapier();
  const [, getKeys] = useKeyboardControls<ControlName>();

  const ray = useMemo(
    () => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }),
    [rapier],
  );

  useFrame((state, delta) => {
    const rb = body.current;
    if (!rb) return;

    const t = rb.translation();

    // Fell off the world — soft respawn, no punishment.
    if (t.y < KILL_Y) {
      rb.setTranslation(SPAWN, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      onRespawn();
      return;
    }

    const keys = getKeys();
    const left = keys.left || touch.current.left;
    const right = keys.right || touch.current.right;
    const wantJump = keys.jump || touch.current.jump;
    const dir = (right ? 1 : 0) - (left ? 1 : 0);

    // Framerate-independent velocity blend toward the target speed.
    const blend = 1 - Math.pow(0.0001, delta);
    const vel = rb.linvel();
    const vx = THREE.MathUtils.lerp(vel.x, dir * MOVE_SPEED, blend);

    // Grounded = short ray straight down, ignoring our own body.
    ray.origin.x = t.x;
    ray.origin.y = t.y;
    ray.origin.z = t.z;
    const hit = world.castRay(
      ray,
      GROUND_RAY_LENGTH,
      true,
      rapier.QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      rb,
    );
    const grounded = hit !== null;

    let vy = vel.y;
    const now = state.clock.elapsedTime;
    if (wantJump && grounded && now - lastJump.current > JUMP_COOLDOWN) {
      vy = JUMP_VELOCITY;
      lastJump.current = now;
    }

    rb.setLinvel({ x: vx, y: vy, z: 0 }, true);

    // Share state with the camera rig + HUD progress bar (no React re-renders).
    tracker.current.x = t.x;
    tracker.current.y = t.y;
    tracker.current.vx = vx;
    progress.set(THREE.MathUtils.clamp(t.x / finishX, 0, 1));

    // Visual charm: turn toward travel direction, bob while running.
    if (dir !== 0) facing.current = dir;
    const vis = visual.current;
    if (vis) {
      vis.rotation.y = THREE.MathUtils.lerp(
        vis.rotation.y,
        facing.current * 0.55,
        blend,
      );
      const running = grounded && Math.abs(vx) > 0.6;
      const targetScaleY = running ? 1 + Math.sin(now * 13) * 0.045 : 1;
      vis.scale.y = THREE.MathUtils.lerp(vis.scale.y, targetScaleY, 0.35);
    }
  });

  return (
    <RigidBody
      ref={body}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
      colliders={false}
      lockRotations
      enabledTranslations={[true, true, false]}
      ccd
    >
      <CapsuleCollider args={[0.15, 0.35]} friction={0} />

      <group ref={visual}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.35, 0.3, 8, 20]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.55} />
        </mesh>

        {/* Eyes */}
        <group position={[0, 0.16, 0]}>
          <mesh position={[-0.13, 0, 0.28]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={EYE_WHITE} />
          </mesh>
          <mesh position={[0.13, 0, 0.28]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={EYE_WHITE} />
          </mesh>
          <mesh position={[-0.12, 0, 0.355]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshBasicMaterial color={PUPIL} />
          </mesh>
          <mesh position={[0.14, 0, 0.355]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshBasicMaterial color={PUPIL} />
          </mesh>
        </group>

        {/* Smile — half torus, arc opening upward */}
        <mesh position={[0, -0.04, 0.335]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.09, 0.018, 8, 16, Math.PI]} />
          <meshBasicMaterial color={PUPIL} />
        </mesh>

        {/* Antenna sprout */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial
            color="#f5d39a"
            emissive="#f5d39a"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
    </RigidBody>
  );
}
