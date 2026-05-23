"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * PulseScene — concentric ripples radiating outward from a single point.
 * Used for /contact — the "signal goes out" metaphor.
 */

function Ripples({ count = 6 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const ringsData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      delay: (i / count) * 2.5,
    }));
  }, [count]);

  useFrame(({ mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = -Math.PI / 2 + mouse.y * 0.35;
      groupRef.current.rotation.y = mouse.x * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      {ringsData.map((r, i) => (
        <Ripple key={i} delay={r.delay} />
      ))}
    </group>
  );
}

function Ripple({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const period = 4;

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = ((clock.elapsedTime + delay) % period) / period;
    const radius = 0.4 + t * 4;
    ref.current.scale.set(radius, radius, 1);
    matRef.current.opacity = (1 - t) * 0.55;
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color="#F6CE48"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.4;
      const s = 0.42 + Math.sin(clock.elapsedTime * 1.6) * 0.04;
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#F6CE48" />
    </mesh>
  );
}

export function PulseScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 3, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <Core />
          <Ripples count={5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
