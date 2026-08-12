"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

// First item is the primary identity and the reduced-motion / no-JS resting word.
const DEFAULT_WORDS = [
  "Chayanon Pond",
  "a Developer",
  "Full-Stack Dev",
  "a Problem Solver",
];
const INTERVAL = 4000; // ms between words
const DURATION = 0.6; // s slide

/**
 * Vertical word carousel for the hero headline's green phrase. A stacked track
 * slides up one row every ~4s (masked clip, --ease-expo). A clone of the first
 * word is appended so the loop always slides UP and resets invisibly when it
 * lands back on "Chayanon Pond". The container reserves the width of the longest
 * word so layout never jumps and (with the hero's overflow-hidden as a backstop)
 * it can't add page scrollWidth.
 *
 * Accessibility: the visual track is aria-hidden and the container exposes a
 * stable accessible name ("Chayanon Pond") so screen readers never hear churn.
 * Reduced motion: no rotation — the first word is shown static.
 */
export default function RotatingWord({ words }: { words?: string[] }) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLSpanElement>(null);
  const WORDS = words && words.length ? words : DEFAULT_WORDS;

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return; // reduced motion → static first word

    const rows = WORDS.length; // real rows; a clone of row 0 sits at index `rows`
    const stepPct = 100 / (rows + 1);
    let index = 0;

    const step = () => {
      index += 1;
      gsap.to(track, {
        yPercent: -stepPct * index,
        duration: DURATION,
        ease: "expo.out",
        onComplete: () => {
          if (index === rows) {
            index = 0;
            gsap.set(track, { yPercent: 0 }); // clone == first word → invisible reset
          }
        },
      });
    };

    const timer = window.setInterval(step, INTERVAL);
    return () => {
      window.clearInterval(timer);
      gsap.killTweensOf(track);
    };
  }, [reduced]);

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom hl"
      style={{ height: "1.2em" }}
      aria-label={WORDS[0]}
    >
      <span ref={trackRef} aria-hidden className="flex flex-col">
        {[...WORDS, WORDS[0]].map((w, i) => (
          <span
            key={i}
            className="block whitespace-nowrap"
            style={{ height: "1.2em", lineHeight: "1.2" }}
          >
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
