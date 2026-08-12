"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { usePhysicsField } from "@/hooks/usePhysicsField";
import { clusterLogos } from "@/lib/techLogos";

// Chip radii (a little size variety), and a deterministic 4-column spread so
// they start apart. Positions are re-clamped to the container by the hook.
const RADII = [30, 26, 28, 25, 29, 27, 26, 24, 28, 26, 27, 25, 29];
const COLS = 4;
const SEEDS = clusterLogos.map((_, i) => ({
  fx: 0.16 + (i % COLS) * 0.23,
  fy: 0.18 + Math.floor(i / COLS) * 0.24,
}));

/**
 * Draggable, physics-driven cluster of real colored tech logos (Stack section,
 * right column). Same engine as the hero's FloatingCircles via the shared
 * `usePhysicsField` hook — gentle drift, wall bounce, elastic collisions, grab to
 * drag (stays where dropped), flick to throw. Each node is a light frosted chip
 * (so dark brand marks stay legible on the dark theme) holding a local SVG logo.
 *
 * Contained in its own bounded box (overflow-hidden), so it can never cause
 * horizontal overflow. Only the chips are pointer-events:auto; touch-action:none
 * keeps a grab from hijacking page scroll. Reduced motion: static but draggable.
 */
export default function LogoCluster() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { onPointerDown, onPointerMove, onPointerUp } = usePhysicsField({
    containerRef,
    nodeRefs,
    radii: RADII,
    seeds: SEEDS,
    reduced,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-line md:h-[480px]"
      style={{
        opacity: 0,
        background:
          "radial-gradient(60% 60% at 50% 45%, rgba(34,224,122,0.06), transparent 72%)",
      }}
    >
      <span className="pointer-events-none absolute left-4 top-4 z-10 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted">
        drag the logos
      </span>
      {clusterLogos.map((logo, i) => (
        <div
          key={logo.label}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          onPointerDown={onPointerDown(i)}
          onPointerMove={onPointerMove(i)}
          onPointerUp={onPointerUp(i)}
          onPointerCancel={onPointerUp(i)}
          title={logo.label}
          aria-hidden
          className="pointer-events-auto absolute left-0 top-0 grid place-items-center rounded-full"
          style={{
            width: RADII[i] * 2,
            height: RADII[i] * 2,
            touchAction: "none",
            cursor: "grab",
            background: "rgba(245,247,245,0.92)",
            border: "1px solid rgba(34,224,122,0.4)",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.35), 0 0 16px rgba(34,224,122,0.18)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt=""
            aria-hidden
            draggable={false}
            style={{
              width: "56%",
              height: "56%",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
