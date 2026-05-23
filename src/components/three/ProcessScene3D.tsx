"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * ProcessScene3D — pinned, scroll-scrubbed 3D scene representing
 * Gigmote's 4-phase operating blueprint:
 *
 *   01 Operational audit   → 02 Precision match
 *   → 03 Managed integration → 04 Scale & optimise
 *
 * Each phase is a node along an arc. The camera scrubs along the arc,
 * focusing on the active node as you scroll. Connecting lines pulse
 * gold once each node is reached. Whole rig is suspended in the same
 * particle "talent network" used in the hero so the visual language stays
 * coherent.
 *
 * The driving signal `progress` (0..1) is read from the parent via a
 * window-attached state object — keeps the React tree shallow and
 * avoids a fresh render every frame.
 */

type ProcessState = { progress: number };

const processState: ProcessState = { progress: 0 };

export function setProcessProgress(p: number) {
  processState.progress = Math.min(Math.max(p, 0), 1);
}

const STEP_COUNT = 4;
const ARC_RADIUS = 6.5;
const ARC_HEIGHT = 0.8;

// 4 evenly-spaced nodes laid along a gentle arc
const NODES = Array.from({ length: STEP_COUNT }, (_, i) => {
  const t = i / (STEP_COUNT - 1);
  return new THREE.Vector3(
    THREE.MathUtils.lerp(-ARC_RADIUS, ARC_RADIUS, t),
    Math.sin(t * Math.PI) * ARC_HEIGHT - 0.2,
    Math.cos(t * Math.PI - 0.5) * 0.6
  );
});

function ConnectorLine() {
  // We construct the THREE.Line manually and mount it via <primitive>,
  // because the JSX <line> intrinsic collides with the SVG <line> type
  // in TypeScript's lib.dom and there's no clean way to disambiguate.
  const { line, material, total } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(NODES, false, "catmullrom", 0.4);
    const pts = curve.getPoints(120);
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const material = new THREE.LineBasicMaterial({
      color: "#F6CE48",
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const line = new THREE.Line(geometry, material);
    return { line, material, total: pts.length };
  }, []);

  useFrame(() => {
    const p = processState.progress;
    material.opacity = 0.25 + p * 0.4;
    const draw = Math.floor(p * total);
    line.geometry.setDrawRange(0, Math.max(2, draw));
  });

  return <primitive object={line} />;
}

function Node({ index, position }: { index: number; position: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const localT = (index / (STEP_COUNT - 1)) * 0.98;
    const active = Math.max(0, Math.min(1, (processState.progress - localT + 0.18) / 0.22));
    const baseScale = 0.5 + active * 0.4;

    groupRef.current.scale.x +=
      (baseScale - groupRef.current.scale.x) * 0.08;
    groupRef.current.scale.y = groupRef.current.scale.x;
    groupRef.current.scale.z = groupRef.current.scale.x;

    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.4 * (index % 2 === 0 ? 1 : -1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.2 + active * 0.65;
    }

    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHSL(0.13, 0.9, 0.5 + active * 0.25);
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.55, 0.62, 64]} />
        <meshBasicMaterial
          color="#F6CE48"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Mid hairline ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.79, 64]} />
        <meshBasicMaterial
          color="#F9F9F5"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshBasicMaterial color="#F6CE48" />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color="#F6CE48" transparent opacity={0.07} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ProcessParticles({ count = 350 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a tall ellipsoid behind the arc
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#F9F9F5" transparent opacity={0.4} depthWrite={false} />
    </points>
  );
}

function CameraScrub() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    const p = processState.progress;
    // Pan camera from left to right along the arc
    const targetX = THREE.MathUtils.lerp(-ARC_RADIUS * 0.7, ARC_RADIUS * 0.7, p);
    // Subtle z dolly — closer at the start, pulls back as you reach the end (for "scope")
    const targetZ = THREE.MathUtils.lerp(5, 7.5, p);
    // Y drift
    const targetY = Math.sin(p * Math.PI) * 0.4 + 0.1;

    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.position.z += (targetZ - camera.position.z) * 0.06;

    // Aim at the active node
    const aimIdx = Math.min(STEP_COUNT - 1, Math.floor(p * STEP_COUNT));
    const aim = NODES[aimIdx];
    target.lerp(aim, 0.06);
    camera.lookAt(target);
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
              intensity={0.55}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.45}
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

export function ProcessScene3D({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "150px" });
  return (
    <div ref={hostRef} className={className} aria-hidden>
      <Canvas
        camera={{ position: [-4, 0.5, 5], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <pointLight position={[0, 4, 3]} intensity={1.2} color="#F6CE48" />
          <pointLight position={[6, -2, -2]} intensity={0.4} color="#9AD2D2" />

          <CameraScrub />

          {/* Halved particle count. Connector line + 4 lit nodes carry the
              visual; the extra particles were ornament. */}
          <ProcessParticles count={150} />
          <ConnectorLine />
          {NODES.map((p, i) => (
            <Node key={i} index={i} position={p} />
          ))}

          {/* Bloom disabled — see HeroScene.tsx note. */}
          {/* <PostEffects /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
