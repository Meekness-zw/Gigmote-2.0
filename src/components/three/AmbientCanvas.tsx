"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * AmbientCanvas — drop-in WebGL background for inner-page heroes.
 *
 * A drifting field of particles + a slow-rotating gold filigree
 * torus. Cheaper than the home hero scene (no shaders, low poly),
 * but keeps the brand language consistent on every page.
 */

const ACCENT_HEX: Record<string, string> = {
  gold: "#F6CE48",
  teal: "#9AD2D2",
  sage: "#C7D6C3",
  orange: "#E8A67E",
};

function Particles({ count = 200, color }: { count?: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count]);

  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.025;
      ref.current.rotation.x += (mouse.y * 0.06 - ref.current.rotation.x) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color={color}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

function Filigree({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.05;
      ref.current.rotation.x =
        Math.sin(clock.elapsedTime * 0.2) * 0.2 + mouse.y * 0.35;
      ref.current.rotation.z += (mouse.x * 0.35 - ref.current.rotation.z) * 0.06;
    }
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.4, 0.06, 200, 18, 2, 5]} />
      <meshBasicMaterial color={color} transparent opacity={0.22} wireframe />
    </mesh>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 1.1 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
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
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.45}
              luminanceSmoothing={0.5}
              mipmapBlur
            />
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

interface Props {
  accent?: "gold" | "teal" | "sage" | "orange";
  className?: string;
}

export function AmbientCanvas({ accent = "gold", className }: Props) {
  const color = ACCENT_HEX[accent] ?? ACCENT_HEX.gold;
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Rig />
          <Filigree color={color} />
          <Particles color={color} />
          {/* Bloom disabled by default on inner pages. The filigree wireframe
              already reads as ambient ornament — no need for the post pass. */}
          {/* <PostEffects /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
