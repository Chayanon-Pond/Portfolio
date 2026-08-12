"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import { type ComponentRef, useEffect, useRef } from "react";
import type { Group, Mesh } from "three";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const BASE_DISTORT = 0.42;
const BASE_SPEED = 1.6;

// Base blob size by viewport width. Desktop/iPad (>=768) is unchanged at 1.6;
// phones get a smaller blob so it doesn't dominate the hero.
function heroScale(w: number) {
  if (w < 480) return 1.05;
  if (w < 768) return 1.3;
  return 1.6;
}

/** drei's MeshDistortMaterial instance exposes animatable `distort`/`speed`. */
type DistortMaterial = ComponentRef<typeof MeshDistortMaterial>;

/**
 * The hero centerpiece: a gooey green blob you can grab and stretch.
 *
 * Structure separates two concerns so they never fight:
 *  - an outer <group> holds all *interaction* transforms (anisotropic stretch,
 *    drag-tilt, lean) and springs back to identity on release;
 *  - the inner <mesh> keeps its own perpetual idle spin (never reset).
 *
 * Grab pushes MeshDistortMaterial `distort`/`speed` up (gooey stretch) and scales
 * the group along the drag vector. Release runs a GSAP `elastic.out` spring on
 * the shared target object; during the spring we snap current→target each frame
 * so the full elastic overshoot shows. Re-grab kills the tween. Values are
 * lerped every frame for smoothness. It can never be left stretched — every
 * release lands the target back at rest.
 *
 * Touch: a press on the blob only becomes a grab once the gesture reads as a
 * horizontal drag; a vertical intent disarms so the page scrolls normally — we
 * never hijack vertical scroll. Reduced motion: no grab drama, a soft static
 * blob only.
 */
function Blob({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const matRef = useRef<DistortMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const state = useRef({
    grabbed: false,
    armed: false, // touch: waiting to classify drag direction
    releasing: false,
    hovered: false,
    startX: 0,
    startY: 0,
  });

  const cur = useRef({
    sx: 1, sy: 1, sz: 1, rx: 0, ry: 0, px: 0, py: 0, distort: BASE_DISTORT,
  });
  const tgt = useRef({
    sx: 1, sy: 1, sz: 1, rx: 0, ry: 0, px: 0, py: 0, distort: BASE_DISTORT,
  });

  // Global pointer for the gentle hover lean / idle parallax.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Responsive base size: smaller blob on phones, desktop/iPad untouched.
  // Applied imperatively to the inner mesh (its base scale never animates —
  // interaction transforms live on the outer group).
  useEffect(() => {
    const apply = () => {
      if (mesh.current) mesh.current.scale.setScalar(heroScale(window.innerWidth));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const applyDrag = (e: ThreeEvent<PointerEvent>) => {
    const s = state.current;
    const mx = Math.max(-1, Math.min(1, (e.clientX - s.startX) / 320));
    const my = Math.max(-1, Math.min(1, (e.clientY - s.startY) / 320));
    const ax = Math.abs(mx);
    const ay = Math.abs(my);
    const t = tgt.current;
    // Anisotropic stretch along the drag, with a bit of perpendicular squash.
    t.sx = 1 + 0.55 * ax - 0.2 * ay;
    t.sy = 1 + 0.55 * ay - 0.2 * ax;
    t.sz = 1 - 0.12 * (ax + ay);
    t.ry = mx * 0.6;
    t.rx = my * 0.6;
    t.px = mx * 0.4;
    t.py = -my * 0.4;
    t.distort = BASE_DISTORT + 0.4; // gooey stretch while grabbed
  };

  const beginGrab = (e: ThreeEvent<PointerEvent>) => {
    const s = state.current;
    s.grabbed = true;
    s.armed = false;
    s.releasing = false;
    gsap.killTweensOf(tgt.current);
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      /* capture is best-effort */
    }
  };

  const release = () => {
    const s = state.current;
    s.releasing = true;
    gsap.killTweensOf(tgt.current);
    gsap.to(tgt.current, {
      sx: 1, sy: 1, sz: 1, rx: 0, ry: 0, px: 0, py: 0,
      distort: BASE_DISTORT,
      duration: reduced ? 0.4 : 1.1,
      ease: reduced ? "power2.out" : "elastic.out(1, 0.35)",
      onComplete: () => {
        s.releasing = false;
      },
    });
  };

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (reduced) return;
    e.stopPropagation();
    const s = state.current;
    s.startX = e.clientX;
    s.startY = e.clientY;
    if (e.pointerType === "touch") {
      s.armed = true; // classify on first move so vertical scroll is preserved
      s.grabbed = false;
    } else {
      beginGrab(e);
    }
  };

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (reduced) return;
    const s = state.current;
    if (s.grabbed) {
      applyDrag(e);
      return;
    }
    if (s.armed) {
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (Math.hypot(dx, dy) > 8) {
        if (Math.abs(dx) > Math.abs(dy)) {
          beginGrab(e);
          applyDrag(e);
        } else {
          s.armed = false; // vertical → let the page scroll
        }
      }
    }
  };

  const onUp = (e: ThreeEvent<PointerEvent>) => {
    const s = state.current;
    s.armed = false;
    if (s.grabbed) {
      s.grabbed = false;
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
      release();
    }
  };

  useFrame((_, delta) => {
    const m = mesh.current;
    const g = group.current;
    if (!m || !g) return;

    if (!reduced) {
      // Perpetual idle spin lives on the inner mesh only.
      m.rotation.y += delta * 0.14;
      m.rotation.z += delta * 0.04;

      const s = state.current;
      const t = tgt.current;
      const c = cur.current;

      if (!s.grabbed && !s.releasing) {
        if (s.hovered) {
          t.sx = 1.04; t.sy = 1.04; t.sz = 1.04;
          t.ry = pointer.current.x * 0.25;
          t.rx = pointer.current.y * 0.2;
          t.px = pointer.current.x * 0.12;
          t.py = -pointer.current.y * 0.12;
          t.distort = BASE_DISTORT + 0.06;
        } else {
          t.sx = 1; t.sy = 1; t.sz = 1;
          t.rx = 0; t.ry = 0; t.px = 0; t.py = 0;
          t.distort = BASE_DISTORT;
        }
      }

      // During release GSAP owns the target: snap current to it so the elastic
      // overshoot is visible. Otherwise ease toward the target.
      const k = s.releasing ? 1 : s.grabbed ? 0.2 : 0.08;
      c.sx += (t.sx - c.sx) * k;
      c.sy += (t.sy - c.sy) * k;
      c.sz += (t.sz - c.sz) * k;
      c.rx += (t.rx - c.rx) * k;
      c.ry += (t.ry - c.ry) * k;
      c.px += (t.px - c.px) * k;
      c.py += (t.py - c.py) * k;
      c.distort += (t.distort - c.distort) * k;
    }

    // Under reduced motion nothing above ran; leave the calm static frame
    // (identity group + the low `distort` set on the material prop) untouched.
    if (reduced) return;

    const c = cur.current;
    g.scale.set(c.sx, c.sy, c.sz);
    g.rotation.x = c.rx;
    g.rotation.y = c.ry;
    g.position.x = c.px;
    g.position.y = c.py;
    if (matRef.current) {
      matRef.current.distort = c.distort;
    }
  });

  return (
    <group ref={group}>
      <Float
        speed={reduced ? 0 : 1.4}
        rotationIntensity={reduced ? 0 : 0.4}
        floatIntensity={reduced ? 0 : 0.8}
      >
        <mesh
          ref={mesh}
          scale={heroScale(window.innerWidth)}
          onPointerOver={() => {
            if (!reduced) state.current.hovered = true;
          }}
          onPointerOut={() => {
            state.current.hovered = false;
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
        >
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial
            ref={matRef}
            color="#0f3d28"
            emissive="#22e07a"
            emissiveIntensity={0.35}
            roughness={0.28}
            metalness={0.55}
            distort={reduced ? 0.18 : BASE_DISTORT}
            speed={reduced ? 0 : BASE_SPEED}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Scene() {
  const reduced = usePrefersReducedMotion();
  // Dynamically imported with ssr:false, so `window` is available on first
  // render — cap DPR lower on small screens to keep the blob cheap.
  const dpr: [number, number] = window.innerWidth < 768 ? [1, 1.25] : [1, 1.5];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 45 }}
      // Under reduced motion nothing animates, but the blob is still grab-free
      // and must render its single static frame.
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#8affc6" />
      <pointLight position={[-5, -3, -4]} intensity={1.4} color="#22e07a" />
      <Blob reduced={reduced} />
    </Canvas>
  );
}
