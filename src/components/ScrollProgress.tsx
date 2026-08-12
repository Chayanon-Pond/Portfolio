"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToTarget } from "@/lib/scroll";

const SIZE = 84;
const CENTER = SIZE / 2; // 42
const STROKE = 3;
const R = 37; // radius inside an 84×84 viewBox with room for the 3px stroke
const C = 2 * Math.PI * R;

/**
 * Fixed bottom-right scroll-progress ring. A faint track with a green arc whose
 * `stroke-dashoffset` fills 0→100% across the full page height, driven by a
 * ScrollTrigger `onUpdate` (self.progress) so it stays locked to Lenis. Clicking
 * smooth-scrolls back to the top. Fades in after a little scrolling and is the
 * only pointer-events target — the rest of the layer is inert, so it never traps
 * clicks or shifts layout. Under reduced motion the arc still tracks progress but
 * the click jumps instantly.
 */
export default function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const arcRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const arc = arcRef.current;
    if (!arc) return;

    gsap.registerPlugin(ScrollTrigger);

    const setProgress = (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      arc.style.strokeDashoffset = `${C * (1 - clamped)}`;
    };

    let shown = false;
    const syncVisible = () => {
      const next = window.scrollY > 100;
      if (next !== shown) {
        shown = next;
        setVisible(next);
      }
    };

    setProgress(0);
    syncVisible();

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setProgress(self.progress);
        syncVisible();
      },
    });

    return () => st.kill();
  }, []);

  const toTop = () => scrollToTarget(0, { immediate: reduced });

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-40 origin-bottom-right max-sm:scale-[0.72] md:bottom-7 md:right-7"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 0.5s var(--ease-expo), transform 0.5s var(--ease-expo)",
      }}
    >
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        data-cursor="Top"
        className="group relative grid place-items-center rounded-full backdrop-blur-sm"
        style={{
          width: SIZE,
          height: SIZE,
          pointerEvents: visible ? "auto" : "none",
          background: "rgba(10,10,11,0.4)",
        }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={STROKE}
          />
          <circle
            ref={arcRef}
            cx={CENTER}
            cy={CENTER}
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{ strokeDasharray: C, strokeDashoffset: C }}
          />
        </svg>
        <span
          aria-hidden
          className="absolute text-foreground transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{ color: "var(--accent)" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3.5 12.5 L10 6 L16.5 12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
