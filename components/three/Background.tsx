"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Particles({ count = 4500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // sphere shell so particles have real depth, not a flat plane
      const r = 4 + Math.random() * 7;
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
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    // mouse parallax — lerp toward pointer for inertia
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      state.pointer.x * 0.45,
      0.05,
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      state.pointer.y * 0.3,
      0.05,
    );
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.018}
        color="#f5d39a"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

function Floaters() {
  return (
    <group>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.9}>
        <mesh position={[3.2, 1.4, -2]}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshBasicMaterial
            color="#f5d39a"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>
      <Float speed={1.9} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh position={[-3.4, -0.8, -2.5]}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial
            color="#a8c8ff"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[1.9, -2.2, -3]}>
          <torusGeometry args={[0.5, 0.14, 16, 48]} />
          <meshBasicMaterial
            color="#f5d39a"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-20">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Particles />
          <Floaters />
        </Suspense>
      </Canvas>
    </div>
  );
}
