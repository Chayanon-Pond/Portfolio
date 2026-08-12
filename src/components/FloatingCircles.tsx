"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { usePhysicsField } from "@/hooks/usePhysicsField";

// Eight small circles, a few different sizes — a weightless, floating-in-space
// feel; scattered across the open space away from the left-aligned hero copy.
const RADII = [22, 14, 28, 18, 12, 24, 16, 20];
const SEEDS = [
  { fx: 0.72, fy: 0.24 },
  { fx: 0.86, fy: 0.58 },
  { fx: 0.6, fy: 0.82 },
  { fx: 0.9, fy: 0.18 },
  { fx: 0.5, fy: 0.48 },
  { fx: 0.78, fy: 0.88 },
  { fx: 0.94, fy: 0.4 },
  { fx: 0.66, fy: 0.1 },
];

const GLOWS = [
  "0 0 28px rgba(34,224,122,0.28), inset 0 0 14px rgba(34,224,122,0.18)",
  "0 0 20px rgba(34,224,122,0.22), inset 0 0 10px rgba(34,224,122,0.14)",
  "0 0 36px rgba(34,224,122,0.3), inset 0 0 18px rgba(34,224,122,0.16)",
  "0 0 22px rgba(34,224,122,0.24), inset 0 0 12px rgba(34,224,122,0.15)",
];

/**
 * A tiny physics playground of 4 small green/glass circles living in the hero.
 * All the physics/drag/throw logic lives in the shared `usePhysicsField` hook;
 * this component only renders the green nodes. The container is
 * pointer-events:none and sits BELOW the z-10 hero text/CTA so nav, VIEW
 * PORTFOLIO, Get in touch, and copy stay fully clickable — only the circle nodes
 * capture pointer input. Decorative → aria-hidden.
 */
export default function FloatingCircles() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { onPointerDown, onPointerMove, onPointerUp } = usePhysicsField({
    containerRef,
    nodeRefs,
    radii: RADII,
    seeds: SEEDS,
    reduced,
    // Small circles bounce off the big central hero blob.
    blob: { fx: 0.52, fy: 0.5, fr: 0.3, e: 0.85 },
  });

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      style={{ opacity: 0 }}
    >
      {RADII.map((r, i) => (
        <div
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          onPointerDown={onPointerDown(i)}
          onPointerMove={onPointerMove(i)}
          onPointerUp={onPointerUp(i)}
          onPointerCancel={onPointerUp(i)}
          className="pointer-events-auto absolute left-0 top-0 rounded-full"
          style={{
            width: r * 2,
            height: r * 2,
            touchAction: "none",
            cursor: "grab",
            background:
              "radial-gradient(60% 60% at 35% 30%, rgba(34,224,122,0.30), rgba(34,224,122,0.06) 60%, rgba(255,255,255,0.02))",
            border: "1px solid rgba(34,224,122,0.35)",
            boxShadow: GLOWS[i % GLOWS.length],
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />
      ))}
    </div>
  );
}
