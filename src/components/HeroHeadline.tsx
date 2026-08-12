"use client";

import { ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import RotatingWord from "@/components/RotatingWord";

function WordMask({ children }: { children: ReactNode }) {
  return (
    <span className="word-mask">
      <span className="word-inner">{children}</span>
    </span>
  );
}

/**
 * The hero H1: "Hello, I'm" + the auto-rotating green identity word. Line one
 * keeps the signature word-rise reveal on mount (masked translateY 110%→0,
 * staggered, --ease-expo); the rotating word rises once with it, then cycles.
 * Fail-safe: the resting state is visible (CSS default), reduced motion pins the
 * rise to 0 and the rotation is disabled inside RotatingWord.
 *
 * The size clamp is chosen so the longest rotating phrase ("a Problem Solver")
 * fits at 375px; the hero section's overflow-hidden is the hard backstop.
 */
export default function HeroHeadline({ words }: { words?: string[] }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>(".word-inner");
    if (reduced) {
      gsap.set(inners, { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 110 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.09,
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <h1
      ref={ref}
      className="max-w-[18ch] text-[clamp(2rem,8.5vw,8.5rem)] font-semibold leading-[1.04] tracking-[-0.03em]"
    >
      <span className="reveal-line">
        <WordMask>Hello,</WordMask> <WordMask>I&apos;m</WordMask>
      </span>
      <span className="reveal-line">
        <WordMask>
          <RotatingWord words={words} />
        </WordMask>
      </span>
    </h1>
  );
}
