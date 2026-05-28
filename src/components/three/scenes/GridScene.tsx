"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * GridScene — receding architectural grid with vertical pillars. Used
 * for /pricing — implies precision, transparency, structure.
 */

function GroundGrid() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      // Subtle drift forward — implies motion / progress
      ref.current.position.z = (clock.elapsedTime * 0.5) % 2 - 4;
      ref.current.rotation.z += (mouse.x * 0.18 - ref.current.rotation.z) * 0.05;
      ref.current.position.x += (mouse.x * 1.2 - ref.current.position.x) * 0.04;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.5, -4]}>
      <planeGeometry args={[20, 20, 24, 24]} />
      <meshBasicMaterial color="#C9A22E" wireframe transparent opacity={0.42} />
    </mesh>
  );
}

function Pillars() {
  const groupRef = useRef<THREE.Group>(null);
  const pillars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 6 - 3,
        h: 0.5 + Math.random() * 2.2,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouse.x * 0.4 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (mouse.y * -0.15 - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {pillars.map((p, i) => (
        <mesh key={i} position={[p.x, -1.5 + p.h / 2, p.z]}>
          <boxGeometry args={[0.04, p.h, 0.04]} />
          <meshBasicMaterial
            color="#1A1A22"
            transparent
            opacity={0.32}
          />
        </mesh>
      ))}
    </group>
  );
}

export function GridScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 0.8, 5], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <GroundGrid />
          <Pillars />
        </Suspense>
      </Canvas>
    </div>
  );
}
