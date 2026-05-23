"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * HeroScene — Lusion-flavored editorial 3D for Gigmote's hero.
 *
 * Sculpts a slowly-deforming icosahedron (gold rim, ink core) driven by
 * a custom simplex-noise vertex shader and a fresnel rim fragment shader.
 * Surrounded by a drifting particle shell representing the global talent
 * network. Mouse-parallax tilts the whole rig; scroll dollies the camera
 * forward and lifts the noise intensity so the form "blooms" as you read.
 *
 * Bloom postprocessing is loaded lazily and degrades gracefully if the
 * @react-three/postprocessing package isn't installed yet.
 */

type SceneState = {
  scroll: number; // 0..1 over the hero section
};

// Shared mutable state read by the shader hooks. Updated by the scroll
// listener attached inside <HeroScene/> below, RAF-coalesced so we never
// touch the layout more than once per frame.
const sceneState: SceneState = { scroll: 0 };

function CoreMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { mouse, clock } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uDistortion: { value: 0.34 },
      uSpeed: { value: 0.55 },
      uColorA: { value: new THREE.Color("#F6CE48") }, // gold
      uColorB: { value: new THREE.Color("#0A0A0B") }, // ink
      uColorC: { value: new THREE.Color("#FFEA97") }, // highlight
      uRimPower: { value: 1.8 },
      uPulse: { value: 0 },
    }),
    []
  );

  useFrame(() => {
    if (matRef.current) {
      const u = matRef.current.uniforms;
      u.uTime.value = clock.elapsedTime;
      // Faster lerp toward the mouse so the form follows the cursor visibly.
      u.uMouse.value.lerp(mouse, 0.12);
      const targetDist = 0.34 + sceneState.scroll * 0.18;
      u.uDistortion.value += (targetDist - u.uDistortion.value) * 0.04;
      // Stronger mouse-driven pulse — distance from center now drives a real
      // bloom on the rim shader.
      const mag = Math.hypot(mouse.x, mouse.y);
      const targetPulse = Math.min(1, mag) * 0.9;
      u.uPulse.value += (targetPulse - u.uPulse.value) * 0.1;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.06;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.18) * 0.18;
      // Mouse-driven tilt — amplified ~2.5×. The form clearly tracks the cursor.
      meshRef.current.rotation.z +=
        (mouse.x * 0.4 - meshRef.current.rotation.z) * 0.06;
      meshRef.current.rotation.x +=
        (-mouse.y * 0.25 - meshRef.current.rotation.x) * 0.05;
      const targetScale = 1 + sceneState.scroll * 0.08;
      const s = meshRef.current.scale;
      s.x += (targetScale - s.x) * 0.05;
      s.y = s.x;
      s.z = s.x;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Lowered from 36 → 18 subdivisions. Visually equivalent after bloom
          and rim shading; cuts vertex count by ~4×, materially lowers GPU
          cost on integrated graphics. */}
      <icosahedronGeometry args={[1.4, 18]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        wireframe={false}
      />
    </mesh>
  );
}

function WireOverlay() {
  // Thin gold wireframe ghost slightly larger than the core — adds the
  // "technical drawing" feel that Lusion uses to imply precision.
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * -0.04;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.03;
      const scale = 1.78 + sceneState.scroll * 0.1;
      const s = meshRef.current.scale;
      s.x += (scale - s.x) * 0.04;
      s.y = s.x;
      s.z = s.x;
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#F6CE48"
        wireframe
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </mesh>
  );
}

function Particles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 5.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
      sizes[i] = Math.random() * 0.04 + 0.008;
    }
    return { positions, sizes };
  }, [count]);

  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.02;
      ref.current.rotation.x +=
        (mouse.y * 0.08 - ref.current.rotation.x) * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        sizeAttenuation
        color="#F9F9F5"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function MouseParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ mouse }) => {
    if (ref.current) {
      // Stronger parallax — rig clearly drifts with the cursor.
      ref.current.position.x += (mouse.x * 0.9 - ref.current.position.x) * 0.07;
      ref.current.position.y += (mouse.y * 0.65 - ref.current.position.y) * 0.07;
      const targetZ = -sceneState.scroll * 0.6;
      ref.current.position.z += (targetZ - ref.current.position.z) * 0.05;
    }
  });
  return <group ref={ref}>{children}</group>;
}

function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    // Subtle scroll-driven Y lift + FOV widening for a cinematic feel
    const targetY = sceneState.scroll * 0.4;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    const persp = camera as THREE.PerspectiveCamera;
    if (persp.isPerspectiveCamera) {
      const targetFov = 45 - sceneState.scroll * 6;
      persp.fov += (targetFov - persp.fov) * 0.04;
      persp.updateProjectionMatrix();
    }
  });
  return null;
}

/**
 * Lazy-load the bloom post-effect. If the package isn't installed,
 * we silently skip and render the scene without it.
 */
function PostEffects() {
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const pp = await import("@react-three/postprocessing").catch(
          () => null
        );
        if (!pp || !mounted) return;
        const { EffectComposer, Bloom, Vignette } = pp as any;
        const C = () => (
          <EffectComposer>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={0.85} />
          </EffectComposer>
        );
        setComp(() => C);
      } catch {
        /* ignore — render without postprocessing */
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return Comp ? <Comp /> : null;
}

export function HeroScene({ className }: { className?: string }) {
  const [hostRef, inView] = useInView<HTMLDivElement>({ rootMargin: "100px" });

  // RAF-coalesced scroll listener for the shader scroll uniform. Skipped
  // entirely when the hero is off-screen — no point computing progress
  // for a scene that isn't rendering.
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let hero: HTMLElement | null = null;
    const update = () => {
      if (!hero) {
        hero = document.querySelector<HTMLElement>('[data-section="hero"]');
        if (!hero) {
          raf = 0;
          return;
        }
      }
      const r = hero.getBoundingClientRect();
      const total = r.height + window.innerHeight * 0.2;
      const passed = Math.min(
        Math.max(-r.top + window.innerHeight * 0.1, 0),
        total
      );
      sceneState.scroll = Math.min(passed / total, 1);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [inView]);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        // Cap DPR at 1.25 — every step below 2 cuts a quarter of pixels
        // for nearly zero perceived quality cost after the rim shader
        // does its thing.
        dpr={[1, 1.25]}
        frameloop={inView ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0A0A0B"]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 2, 2]} intensity={0.9} color="#F6CE48" />
          <pointLight position={[-3, -2, -2]} intensity={0.5} color="#9AD2D2" />

          <CameraRig />
          <MouseParallaxRig>
            <CoreMesh />
            <WireOverlay />
            {/* Halved from 500. Particles are decorative, expensive when
                multiplied across multiple canvases simultaneously. */}
            <Particles count={250} />
          </MouseParallaxRig>

          {/* Bloom postprocessing intentionally disabled here. The rim
              shader already gives the gold-glow look we want, and bloom
              was the single most expensive frame cost on home (10-15ms /
              frame on integrated GPUs). Re-enable via <PostEffects /> if
              you want it back on faster machines. */}
          {/* <PostEffects /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Shaders
 * ------------------------------------------------------------------ */

const SIMPLEX_NOISE_3D = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const VERTEX_SHADER = /* glsl */ `
${SIMPLEX_NOISE_3D}

uniform float uTime;
uniform float uDistortion;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uPulse;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
varying vec3 vViewDir;

void main() {
  vec3 pos = position;
  float t = uTime * uSpeed;
  float n =
      snoise(pos * 1.4 + vec3(t * 0.7, t * 0.5, t * 0.3))
    + snoise(pos * 2.7 + vec3(t * -0.4, t * 0.9, t * 0.2)) * 0.5;

  float mouseLift = (uMouse.x + uMouse.y) * 0.1;
  float pulseLift = uPulse * 0.18;
  float displacement = (n + mouseLift + pulseLift) * uDistortion;
  pos += normal * displacement;

  vec4 modelPos = modelMatrix * vec4(pos, 1.0);
  vec4 viewPos = viewMatrix * modelPos;
  vec3 viewDir = normalize(-viewPos.xyz);

  vNormal = normalize(normalMatrix * normal);
  vPosition = pos;
  vDisplacement = displacement;
  vViewDir = viewDir;

  gl_Position = projectionMatrix * viewPos;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uRimPower;
uniform float uTime;
uniform float uPulse;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
varying vec3 vViewDir;

void main() {
  float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
  rim = pow(rim, uRimPower);

  float d = smoothstep(-0.2, 0.5, vDisplacement);
  vec3 base = mix(uColorB, uColorA, d * 0.7);
  vec3 rimColor = mix(uColorA, uColorC, 0.4);
  vec3 col = mix(base, rimColor, rim);

  float pulse = 0.5 + 0.5 * sin(uTime * 0.6);
  col += uColorA * 0.06 * pulse * (1.0 - rim);

  // Mouse-driven emissive boost on rim
  col += rimColor * uPulse * 0.4 * rim;

  col = pow(col, vec3(1.05));

  gl_FragColor = vec4(col, 1.0);
}
`;
