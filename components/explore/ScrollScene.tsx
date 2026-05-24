"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/lenis";

function ParticleSphere({ count = 6000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const p = getScrollProgress();
    const t = state.clock.elapsedTime;
    // base drift + scroll-driven full rotation
    ref.current.rotation.y = t * 0.04 + p * Math.PI * 2.2;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.06 + p * Math.PI * 0.6;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#f5d39a"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function CenterCore() {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = getScrollProgress();
    ref.current.rotation.y = p * Math.PI * 4;
    ref.current.rotation.x = p * Math.PI * 2;
    // gentle scale arc — peaks mid-scroll
    const s = 0.85 + Math.sin(p * Math.PI) * 0.35;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.3}>
        <mesh>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial
            color="#f5d39a"
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.55, 0]} />
          <meshBasicMaterial
            color="#a8c8ff"
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </Float>
    </group>
  );
}

function CameraDolly() {
  const { camera } = useThree();

  useFrame(() => {
    const p = getScrollProgress();
    // slight push-in then pull-back to give a sense of motion
    const targetZ = 7 - Math.sin(p * Math.PI) * 1.4;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      Math.sin(p * Math.PI * 2) * 0.4,
      0.06,
    );
  });

  return null;
}

export function ScrollScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ParticleSphere />
          <CenterCore />
          <CameraDolly />
        </Suspense>
      </Canvas>
    </div>
  );
}
