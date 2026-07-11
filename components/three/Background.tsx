"use client";

import { Float } from "@react-three/drei";

/**
 * Wireframe accent shapes — layered over the silk shader for depth.
 * Rendered inside SilkBackground's Canvas via its `floaters` prop
 * (camera: position [0, 0, 5], fov 55).
 */
export function Floaters() {
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
