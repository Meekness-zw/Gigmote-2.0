"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * FlowScene — for AI Business Solutions.
 *
 * A slowly undulating plane with custom GLSL displacement, sitting at an
 * angle so it reads as "data flowing through space." Stylized with a
 * dual-stop gradient (ink → gold) along the wave height and a moiré of
 * orange highlights synced to scroll.
 */

function FlowSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColorLow: { value: new THREE.Color("#0A0A0B") },
      uColorMid: { value: new THREE.Color("#E8A67E") },
      uColorHigh: { value: new THREE.Color("#F6CE48") },
    }),
    []
  );

  useFrame(({ clock, mouse }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uMouse.value.lerp(mouse, 0.12);
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += (mouse.x * 0.22 - meshRef.current.rotation.z) * 0.05;
      meshRef.current.rotation.x +=
        (-Math.PI / 3.4 + mouse.y * 0.15 - meshRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3.4, 0, 0]} position={[0, -0.4, 0]}>
      <planeGeometry args={[12, 12, 96, 96]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        side={THREE.DoubleSide}
        transparent
      />
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
            <Bloom intensity={0.6} luminanceThreshold={0.55} luminanceSmoothing={0.5} mipmapBlur />
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

export function FlowScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });
  return (
    <div ref={hostRef} className={className ?? "h-full w-full"} aria-hidden>
      <Canvas
        camera={{ position: [0, 1.2, 4.2], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <FlowSurface />
          {/* Bloom disabled for perf — see HeroScene.tsx note. */}
          {/* <PostEffects /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}

const VERTEX = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;

varying vec3 vPosition;
varying float vWave;

void main() {
  vec3 pos = position;

  // Layered sine waves at different scales — produces the "data stream"
  // ripple. Mouse magnitude lifts amplitude subtly so the surface
  // breathes when you interact.
  float t = uTime * 0.6;
  float mag = length(uMouse) * 0.3;

  float w1 = sin(pos.x * 0.6 + t) * 0.16;
  float w2 = sin(pos.y * 0.9 - t * 1.4) * 0.12;
  float w3 = sin((pos.x + pos.y) * 0.5 + t * 0.7) * 0.10;
  float wave = (w1 + w2 + w3) * (1.0 + mag);

  pos.z += wave;

  vPosition = pos;
  vWave = wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColorLow;
uniform vec3 uColorMid;
uniform vec3 uColorHigh;
uniform float uTime;

varying vec3 vPosition;
varying float vWave;

void main() {
  // Map wave height [-0.4, 0.4] → 0..1 and use it for the gradient ramp
  float h = clamp((vWave + 0.4) / 0.8, 0.0, 1.0);
  vec3 col = mix(uColorLow, uColorMid, smoothstep(0.0, 0.6, h));
  col = mix(col, uColorHigh, smoothstep(0.6, 1.0, h));

  // Soft scanlines synced to time — adds the "data" feel
  float band = 0.5 + 0.5 * sin((vPosition.y - uTime * 0.3) * 7.0);
  col += vec3(0.08, 0.05, 0.0) * smoothstep(0.85, 1.0, band);

  // Edge fade so the plane dissolves into the ink background
  float dist = length(vPosition.xy) / 6.0;
  float fade = 1.0 - smoothstep(0.55, 1.0, dist);

  gl_FragColor = vec4(col, fade);
}
`;
