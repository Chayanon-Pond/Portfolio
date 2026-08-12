"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouch } from "@/hooks/useIsTouch";

/**
 * Hand-rolled circular cursor: a lagging follower (lerped in rAF) plus an
 * instant dot. Grows / morphs to a label over elements marked with
 * [data-cursor] (links, project cards). Hidden entirely on touch devices,
 * and it never replaces keyboard focus — focus rings live in globals.css.
 */
export default function Cursor() {
  const isTouch = useIsTouch();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.15;
      ring.y += (pos.y - ring.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const SELECTOR = "[data-cursor], a, button";
    let active: HTMLElement | null = null;

    // Track the interactive element under the pointer. `pointerover`/`out`
    // bubble on every nested child, so we only react when the *closest*
    // interactive ancestor actually changes — otherwise the label/ring would
    // flicker while moving across a link's inner spans.
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(SELECTOR);
      if (target === active) return;
      active = target;
      setHovering(!!target);
      setLabel(target?.dataset.cursor || null);
    };
    const onOut = (e: PointerEvent) => {
      const next = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>(
        SELECTOR
      );
      // Still within (or entering) an interactive element → let onOver decide.
      if (next) return;
      if (!active) return;
      active = null;
      setHovering(false);
      setLabel(null);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          border: "1px solid var(--accent)",
          background: hovering ? "var(--accent)" : "transparent",
          transition:
            "width 0.3s var(--ease-expo), height 0.3s var(--ease-expo), background 0.3s",
          ...(hovering && !label ? { width: 64, height: 64 } : null),
          ...(label ? { width: 84, height: 84 } : null),
        }}
      >
        {label ? (
          <span
            className="font-mono text-xs font-medium"
            style={{ color: "#05130a" }}
          >
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full"
        style={{
          width: 5,
          height: 5,
          background: "var(--accent)",
          opacity: hovering ? 0 : 1,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  );
}
