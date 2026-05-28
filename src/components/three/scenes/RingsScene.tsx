"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * RingsScene — concentric rotating rings on different axes. Sculptural,
 * editorial. Used for /about — "many parts, one operating system."
 */

function Rings() {
  const groupRef = useRef<THREE.Group>(null);
  const rings = useMemo(() => {
    const arr: Array<{ radius: number; tube: number; axis: [number, number, number]; speed: number; color: string; opacity: number }> = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        radius: 1 + i * 0.45,
        tube: 0.012,
        axis: [Math.sin(i * 1.7), Math.cos(i * 1.3), Math.sin(i * 0.9)],
        speed: 0.05 + (i % 3) * 0.04,
        color: i % 3 === 0 ? "#C9A22E" : "#1A1A22",
        opacity: 0.5 - i * 0.04,
      });
    }
    return arr;
  }, []);

  useFrame(({ mouse, clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += (mouse.y * 0.7 - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.y += (mouse.x * 0.9 - groupRef.current.rotation.y) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((r, i) => (
        <Ring key={i} {...r} index={i} />
      ))}
    </group>
  );
}

function Ring({
  radius,
  tube,
  axis,
  speed,
  color,
  opacity,
  index,
}: {
  radius: number;
  tube: number;
  axis: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.rotation.set(axis[0] * t, axis[1] * t, axis[2] * t);
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 8, 96]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

export function RingsScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <Rings />
        </Suspense>
      </Canvas>
    </div>
  );
}
