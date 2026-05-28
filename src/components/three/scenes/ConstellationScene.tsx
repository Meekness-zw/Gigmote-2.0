"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * ConstellationScene — a slowly-rotating star field with hairline
 * constellations drawn between selected pairs. Used for /careers and
 * /case-studies: implies the talent / engagement map.
 */

function StarField() {
  const groupRef = useRef<THREE.Group>(null);

  const { positions, linePos } = useMemo(() => {
    const count = 70;
    const positions = new Float32Array(count * 3);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 4 - 1;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      points.push(new THREE.Vector3(x, y, z));
    }
    // Draw a line between each star and its nearest 1 neighbor
    const edges: Array<[number, number]> = [];
    points.forEach((p, i) => {
      let bestJ = -1;
      let bestD = Infinity;
      points.forEach((q, j) => {
        if (i === j) return;
        const d = p.distanceTo(q);
        if (d < bestD) {
          bestD = d;
          bestJ = j;
        }
      });
      if (bestJ >= 0 && bestD < 3) edges.push([i, bestJ]);
    });
    const linePos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => {
      const pa = points[a];
      const pb = points[b];
      linePos[k * 6] = pa.x;
      linePos[k * 6 + 1] = pa.y;
      linePos[k * 6 + 2] = pa.z;
      linePos[k * 6 + 3] = pb.x;
      linePos[k * 6 + 4] = pb.y;
      linePos[k * 6 + 5] = pb.z;
    });
    return { positions, linePos };
  }, []);

  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.04 + mouse.x * 0.45;
      groupRef.current.rotation.x = mouse.y * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#C9A22E" size={0.08} transparent opacity={0.95} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1A1A22" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export function ConstellationScene({ className }: { className?: string }) {
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
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  );
}
