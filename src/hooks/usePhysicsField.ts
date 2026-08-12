"use client";

import { useEffect, useRef } from "react";

type Circle = { x: number; y: number; vx: number; vy: number; r: number };

const DAMPING = 0.995; // near-frictionless "space" drift (velocities persist)
const WANDER = 7; // px/s random impulse per frame → gentle weightless drift
const WALL_E = 0.85; // wall restitution
const E = 0.9; // circle–circle restitution
const MAX_SPEED = 1500; // px/s clamp (keeps throws sane)
const MAX_THROW = 1800; // px/s cap imparted on release

type Opts = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  nodeRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  radii: number[];
  seeds: { fx: number; fy: number }[];
  reduced: boolean;
  // Optional static "blob" the nodes bounce off (hero only). Fractions of bounds.
  blob?: { fx: number; fy: number; fr: number; e: number };
};

type Handler = (i: number) => (e: React.PointerEvent) => void;

/**
 * Shared 2-D physics field for a small set of draggable nodes (the hero's
 * floating circles and the Stack section's tech-logo cluster both use this).
 *
 * One shared rAF integrator handles idle drift (a tiny wander keeps them alive),
 * wall bounce inside the container, and elastic circle–circle collisions
 * (O(n²), resolved with inverse mass — a grabbed node is infinite mass so it
 * shoves others but isn't shoved). Drag leaves a node wherever dropped (no
 * spring-back); a flick imparts smoothed pointer velocity so it flies and bounces,
 * decaying via light damping. Positions are always clamped to the container, so
 * nodes can't escape or cause horizontal overflow.
 *
 * Perf: transform-only translate3d; the loop pauses when the container scrolls
 * out of view (IntersectionObserver) and resumes on return. Reduced motion: no
 * autonomous drift/throw — nodes are static but still draggable (drag just
 * repositions them). Returns pointer-handler factories to spread on each node;
 * `touch-action:none` on the nodes keeps a grab from hijacking page scroll.
 */
export function usePhysicsField({
  containerRef,
  nodeRefs,
  radii,
  seeds,
  reduced,
  blob,
}: Opts): {
  onPointerDown: Handler;
  onPointerMove: Handler;
  onPointerUp: Handler;
} {
  const circles = useRef<Circle[]>([]);
  const bounds = useRef({ w: 0, h: 0 });
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const startRef = useRef<(() => void) | null>(null);
  const grab = useRef<{
    i: number;
    offX: number;
    offY: number;
    lastX: number;
    lastY: number;
    lastT: number;
    vx: number;
    vy: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      bounds.current.w = rect.width;
      bounds.current.h = rect.height;
    };

    const clampInBounds = (c: Circle) => {
      const { w, h } = bounds.current;
      c.x = Math.min(Math.max(c.x, c.r), Math.max(c.r, w - c.r));
      c.y = Math.min(Math.max(c.y, c.r), Math.max(c.r, h - c.r));
    };

    const write = (i: number, c: Circle) => {
      const node = nodeRefs.current[i];
      if (node) {
        node.style.transform = `translate3d(${c.x - c.r}px, ${c.y - c.r}px, 0)`;
      }
    };

    measure();
    if (circles.current.length === 0) {
      const { w, h } = bounds.current;
      circles.current = radii.map((r, i) => ({
        r,
        x: (seeds[i]?.fx ?? 0.5) * (w || window.innerWidth),
        y: (seeds[i]?.fy ?? 0.5) * (h || window.innerHeight),
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
      }));
    }
    circles.current.forEach((c) => clampInBounds(c));
    circles.current.forEach((c, i) => write(i, c));
    container.style.opacity = "1";

    const clampSpeed = (c: Circle, max: number) => {
      const s = Math.hypot(c.vx, c.vy);
      if (s > max) {
        c.vx = (c.vx / s) * max;
        c.vy = (c.vy / s) * max;
      }
    };

    let lastT = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.033);
      lastT = now;
      const fr = dt * 60; // normalise per-frame terms to 60fps
      const { w, h } = bounds.current;
      const cs = circles.current;
      const g = grab.current;

      for (let i = 0; i < cs.length; i++) {
        if (g && g.i === i) continue; // grabbed → pointer-driven
        const c = cs[i];
        c.vx += (Math.random() - 0.5) * WANDER * fr;
        c.vy += (Math.random() - 0.5) * WANDER * fr;
        const d = Math.pow(DAMPING, fr);
        c.vx *= d;
        c.vy *= d;
        clampSpeed(c, MAX_SPEED);
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.x < c.r) {
          c.x = c.r;
          c.vx = Math.abs(c.vx) * WALL_E;
        } else if (c.x > w - c.r) {
          c.x = w - c.r;
          c.vx = -Math.abs(c.vx) * WALL_E;
        }
        if (c.y < c.r) {
          c.y = c.r;
          c.vy = Math.abs(c.vy) * WALL_E;
        } else if (c.y > h - c.r) {
          c.y = h - c.r;
          c.vy = -Math.abs(c.vy) * WALL_E;
        }
        // Bounce off the big central blob (static circle), when configured.
        if (blob) {
          const bcx = w * blob.fx;
          const bcy = h * blob.fy;
          const br = Math.min(w, h) * blob.fr;
          let bdx = c.x - bcx;
          let bdy = c.y - bcy;
          let bd = Math.hypot(bdx, bdy);
          const bmin = br + c.r;
          if (bd < bmin) {
            if (bd === 0) {
              bdx = 1;
              bdy = 0;
              bd = 0.001;
            }
            const bnx = bdx / bd;
            const bny = bdy / bd;
            c.x = bcx + bnx * bmin;
            c.y = bcy + bny * bmin;
            const vn = c.vx * bnx + c.vy * bny;
            if (vn < 0) {
              c.vx -= (1 + blob.e) * vn * bnx;
              c.vy -= (1 + blob.e) * vn * bny;
            }
          }
        }
      }

      // Elastic collisions. A grabbed node is treated as infinite mass.
      for (let i = 0; i < cs.length; i++) {
        for (let j = i + 1; j < cs.length; j++) {
          const a = cs[i];
          const b = cs[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.hypot(dx, dy);
          const min = a.r + b.r;
          if (dist >= min) continue;
          if (dist === 0) {
            dx = 1;
            dy = 0;
            dist = 0.001;
          }
          const nx = dx / dist;
          const ny = dy / dist;
          const invA = g && g.i === i ? 0 : 1 / (a.r * a.r);
          const invB = g && g.i === j ? 0 : 1 / (b.r * b.r);
          const invSum = invA + invB;
          if (invSum === 0) continue;
          const corr = (min - dist) / invSum;
          a.x -= nx * corr * invA;
          a.y -= ny * corr * invA;
          b.x += nx * corr * invB;
          b.y += ny * corr * invB;
          const rvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rvn < 0) {
            const jImp = (-(1 + E) * rvn) / invSum;
            a.vx -= nx * jImp * invA;
            a.vy -= ny * jImp * invA;
            b.vx += nx * jImp * invB;
            b.vy += ny * jImp * invB;
          }
        }
      }

      for (let i = 0; i < cs.length; i++) write(i, cs[i]);
      rafRef.current = requestAnimationFrame(step);
    };

    const startLoop = () => {
      if (reduced || runningRef.current) return;
      runningRef.current = true;
      lastT = performance.now();
      rafRef.current = requestAnimationFrame(step);
    };
    const stopLoop = () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
    startRef.current = startLoop;

    const onResize = () => {
      measure();
      circles.current.forEach((c) => clampInBounds(c));
      circles.current.forEach((c, i) => write(i, c));
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (entries) => {
        const on = entries[0]?.isIntersecting ?? false;
        if (on) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    return () => {
      stopLoop();
      startRef.current = null;
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // radii/seeds are fixed per mount; re-running only on `reduced` is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const pointerPos = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return { px: 0, py: 0 };
    const rect = el.getBoundingClientRect();
    return { px: e.clientX - rect.left, py: e.clientY - rect.top };
  };

  const onPointerDown: Handler = (i) => (e) => {
    const c = circles.current[i];
    if (!c) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const { px, py } = pointerPos(e);
    c.vx = 0;
    c.vy = 0;
    grab.current = {
      i,
      offX: px - c.x,
      offY: py - c.y,
      lastX: px,
      lastY: py,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
    };
  };

  const onPointerMove: Handler = (i) => (e) => {
    const g = grab.current;
    if (!g || g.i !== i) return;
    const c = circles.current[i];
    const { w, h } = bounds.current;
    const { px, py } = pointerPos(e);
    c.x = Math.min(Math.max(px - g.offX, c.r), Math.max(c.r, w - c.r));
    c.y = Math.min(Math.max(py - g.offY, c.r), Math.max(c.r, h - c.r));
    const now = performance.now();
    const dt = (now - g.lastT) / 1000;
    if (dt > 0) {
      g.vx = g.vx * 0.4 + ((px - g.lastX) / dt) * 0.6;
      g.vy = g.vy * 0.4 + ((py - g.lastY) / dt) * 0.6;
      g.lastX = px;
      g.lastY = py;
      g.lastT = now;
    }
    const node = nodeRefs.current[i];
    if (node) {
      node.style.transform = `translate3d(${c.x - c.r}px, ${c.y - c.r}px, 0)`;
    }
  };

  const onPointerUp: Handler = (i) => (e) => {
    const g = grab.current;
    if (!g || g.i !== i) return;
    const c = circles.current[i];
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    if (!reduced) {
      const s = Math.hypot(g.vx, g.vy);
      const k = s > MAX_THROW ? MAX_THROW / s : 1;
      c.vx = g.vx * k;
      c.vy = g.vy * k;
    }
    grab.current = null;
    startRef.current?.();
  };

  return { onPointerDown, onPointerMove, onPointerUp };
}
