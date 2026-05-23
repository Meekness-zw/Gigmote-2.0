"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * NetworkScene — for Global Staffing.
 *
 * A drifting cluster of pulsing nodes connected by hairline edges to their
 * nearest neighbours. As you move the cursor, the rig tilts and the cluster
 * subtly responds, evoking a talent network coming online.
 */

interface NodeData {
  pos: THREE.Vector3;
  phase: number;
  size: number;
}

function Network({ count = 36 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const corePointsRef = useRef<THREE.Points>(null);

  const { nodes, linePositions, lineCount } = useMemo(() => {
    const nodes: NodeData[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const r = 2 + Math.random() * 2;
      const y = (Math.random() - 0.5) * 3;
      nodes.push({
        pos: new THREE.Vector3(
          Math.cos(t) * r + (Math.random() - 0.5) * 0.6,
          y,
          Math.sin(t) * r + (Math.random() - 0.5) * 0.6
        ),
        phase: Math.random() * Math.PI * 2,
        size: 0.5 + Math.random() * 0.5,
      });
    }
    // Build edges: each node to its 2 nearest neighbours
    const edges: Array<[number, number]> = [];
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((o, j) => ({ j, d: n.pos.distanceTo(o.pos) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      dists.forEach((d) => edges.push([i, d.j]));
    });
    const linePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => {
      const pa = nodes[a].pos;
      const pb = nodes[b].pos;
      linePositions[k * 6 + 0] = pa.x;
      linePositions[k * 6 + 1] = pa.y;
      linePositions[k * 6 + 2] = pa.z;
      linePositions[k * 6 + 3] = pb.x;
      linePositions[k * 6 + 4] = pb.y;
      linePositions[k * 6 + 5] = pb.z;
    });
    return { nodes, linePositions, lineCount: edges.length };
  }, [count]);

  const corePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.pos.x;
      arr[i * 3 + 1] = n.pos.y;
      arr[i * 3 + 2] = n.pos.z;
    });
    return arr;
  }, [nodes]);

  useFrame(({ clock, mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.08 + mouse.x * 0.35;
      groupRef.current.rotation.x += (mouse.y * 0.5 - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.z += (mouse.x * 0.25 - groupRef.current.rotation.z) * 0.05;
    }
    // Pulse the node-size attribute
    if (corePointsRef.current) {
      const mat = corePointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.07 + Math.sin(clock.elapsedTime * 1.4) * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#9AD2D2" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {/* Nodes */}
      <points ref={corePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[corePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#F6CE48"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
    </group>
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
            <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.5} mipmapBlur />
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

export function NetworkScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <Network />
          {/* Bloom disabled for perf — see HeroScene.tsx note. */}
          {/* <PostEffects /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
