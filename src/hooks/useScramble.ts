"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/\\<>*+=_·";

/**
 * Hand-rolled text-scramble (no premium ScrambleTextPlugin). Writes directly to
 * a span ref via `textContent` — no per-frame React re-render — and resolves the
 * label left→right from randomized glyphs to the real text over ~`duration`ms.
 *
 * The animation is fully self-cleaning: it always lands on the exact final text,
 * the rAF is cancelled on unmount, and under reduced motion `scramble()` is a
 * no-op so the label simply stays put. SSR-safe because the span also renders
 * `text` as its children, so the first paint matches the hook's steady state.
 */
export function useScramble(text: string, duration = 520) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  // Keep the DOM authoritative on the real text whenever it changes, and make
  // sure any in-flight frame is cancelled if the label is swapped out.
  useEffect(() => {
    if (ref.current) ref.current.textContent = text;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  const scramble = useCallback(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const chars = [...text];
    const start = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealed = progress * chars.length;
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch === " ") {
          out += " ";
        } else if (i < revealed - 1) {
          out += ch;
        } else {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      el.textContent = out;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.textContent = text; // guaranteed to end on the exact label
        rafRef.current = 0;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [text, duration, reduced]);

  return { ref, scramble };
}
