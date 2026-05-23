"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * LatticeScene — for BPO Advisory.
 *
 * A grid of octahedral wireframes drifting in space, evoking the
 * "structured architecture" of an operating-model engagement. Slowly
 * rotating, mouse-tilting, with a single gold node at the center that
 * pulses on hover.
 */

function LatticeGrid({ rows = 5, cols = 8, spacing = 1.6 }: { rows?: number; cols?: number; spacing?: number }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useMemo(() => {
    const arr: { x: number; y: number; z: number; scale: number; rotSpeed: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({
          x: (c - (cols - 1) / 2) * spacing,
          y: (r - (rows - 1) / 2) * spacing,
          z: (Math.random() - 0.5) * 1.5,
          scale: 0.18 + Math.random() * 0.06,
          rotSpeed: 0.4 + Math.random() * 0.4,
        });
      }
    }
    return arr;
  }, [rows, cols, spacing]);

  useFrame(({ clock, mouse }) => {
    if (group.current) {
      group.current.rotation.y += (mouse.x * 0.55 - group.current.rotation.y) * 0.06;
      group.current.rotation.x +=
        (-mouse.y * 0.35 + Math.sin(clock.elapsedTime * 0.1) * 0.04 - group.current.rotation.x) * 0.06;
      group.current.position.z = -2 + Math.sin(clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={group}>
      {meshes.map((m, i) => (
        <LatticeNode key={i} {...m} index={i} />
      ))}
    </group>
  );
}

function LatticeNode({
  x,
  y,
  z,
  scale,
  rotSpeed,
  index,
}: {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotSpeed: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * rotSpeed;
      ref.current.rotation.x = clock.elapsedTime * rotSpeed * 0.6;
      const breathe = 1 + Math.sin(clock.elapsedTime * 0.6 + index * 0.5) * 0.1;
      ref.current.scale.set(scale * breathe, scale * breathe, scale * breathe);
    }
  });
  return (
    <mesh ref={ref} position={[x, y, z]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#F6CE48" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

function CenterCore() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.4;
      ref.current.rotation.x = mouse.y * 0.4;
      const s = 0.55 + Math.sin(clock.elapsedTime * 1.2) * 0.04;
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#F6CE48" />
    </mesh>
  );
}

function PostEffects() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const pp = await import("@react-three/postprocessing").catch(() => null);
        if (!pp || !mounted) return;
        const { EffectComposer, Bloom } = pp as any;
        const C = () => (
          <EffectComposer>
            <Bloom intensity={0.45} luminanceThreshold={0.5} luminanceSmoothing={0.5} mipmapBlur />
          </EffectComposer>
        );
        setComp(() => C);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return Comp ? <Comp /> : null;
}

export function LatticeScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <CenterCore />
          <LatticeGrid />
          {/* Bloom disabled for perf — see HeroScene.tsx note. */}
          {/* <PostEffects /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
