"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { navigateWithTransition } from "@/lib/scroll";

const REST = "VIEW PORTFOLIO";
const HOVER = "DEV PORTFOLIO";
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/\\<>*+=_#";

// Deliberate, watchable decode: ~1.4s total, and glyphs only re-roll every
// ~62ms so you can read letters resolving rather than a blur.
const TOTAL = 1400;
const GLYPH_INTERVAL = 62;

type Props = {
  /** Route pushed (with the wipe transition) when the CTA is clicked. */
  href?: string;
  /** Decode-in once on mount (used for the hero). */
  playOnMount?: boolean;
  className?: string;
};

/**
 * The large "VIEW PORTFOLIO ↗" affordance. Rendered as headline-scale,
 * letter-separated type: each letter is its own span that cycles random glyphs
 * and locks left→right with a small stagger. Two-state, reference-style — rest
 * reads "VIEW PORTFOLIO"; hover/focus decodes to "DEV PORTFOLIO" and back on
 * leave — and it always resolves to the exact final text.
 *
 * Accessibility: the control is a real focusable <button> with an accessible
 * name ("View portfolio"); the per-letter spans are aria-hidden so screen
 * readers never hear scrambled glyphs. Focus-visible styling comes from the
 * global ring (the custom cursor is a separate pointer-events:none layer and
 * never hides it). Reduced motion → no scramble, the final text is shown.
 * Click → full-screen wipe transition → route change to the portfolio.
 */
export default function PortfolioCTA({
  href = "/home",
  playOnMount = false,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState(REST);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef(0);
  const firstRun = useRef(true);

  useEffect(() => {
    // Skip the decode on the initial mount unless explicitly asked.
    if (firstRun.current && !playOnMount) {
      firstRun.current = false;
      return;
    }
    firstRun.current = false;
    if (reduced) return; // static final text is already rendered

    const chars = [...text];
    const isSpace = chars.map((c) => c === " ");
    const letterCount = isSpace.filter((s) => !s).length;

    // Left→right lock schedule for the non-space letters.
    let seen = 0;
    const lockAt = chars.map((_, i) => {
      if (isSpace[i]) return 0;
      const at = TOTAL * 0.12 + (seen / Math.max(1, letterCount)) * TOTAL * 0.8;
      seen++;
      return at;
    });

    const start = performance.now();
    let lastSwap = 0;
    const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const elapsed = now - start;
      const swap = now - lastSwap >= GLYPH_INTERVAL;
      if (swap) lastSwap = now;

      for (let k = 0; k < chars.length; k++) {
        const span = letterRefs.current[k];
        if (!span) continue;
        if (isSpace[k]) {
          span.textContent = " ";
        } else if (elapsed >= lockAt[k]) {
          span.textContent = chars[k];
        } else if (swap) {
          span.textContent = rnd();
        }
      }

      if (elapsed < TOTAL) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Guarantee the exact final text — never leave garbled.
        for (let k = 0; k < chars.length; k++) {
          const span = letterRefs.current[k];
          if (span) span.textContent = isSpace[k] ? " " : chars[k];
        }
        rafRef.current = 0;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, reduced, playOnMount]);

  // Render words as nowrap groups so a word never splits across a line break
  // (keeps big type from overflowing at 375px — whole words wrap instead).
  const words = text.split(" ");
  let gi = 0;

  return (
    <button
      type="button"
      aria-label="View portfolio"
      data-cursor="Go"
      onMouseEnter={() => setText(HOVER)}
      onFocus={() => setText(HOVER)}
      onMouseLeave={() => setText(REST)}
      onBlur={() => setText(REST)}
      onClick={() => navigateWithTransition(href)}
      className={`group inline-flex flex-wrap items-center gap-x-5 gap-y-4 text-left ${className}`}
    >
      <span
        aria-hidden
        className="flex flex-wrap items-baseline gap-x-6 font-semibold uppercase leading-[0.95] tracking-[0.18em] text-[clamp(1.75rem,6.5vw,5rem)]"
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-flex whitespace-nowrap">
            {[...word].map((ch) => {
              const idx = gi++;
              return (
                <span
                  key={idx}
                  ref={(el) => {
                    letterRefs.current[idx] = el;
                  }}
                  className="inline-block"
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accent text-lg text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:h-14 md:w-14"
      >
        ↗
      </span>
    </button>
  );
}
