"use client";

import { CSSProperties, ReactNode } from "react";
import { useInViewReveal } from "@/hooks/useInViewReveal";

/**
 * Lightweight transform/opacity fade-up on scroll-in. Pure IntersectionObserver
 * + CSS (see `.reveal` in globals.css) — resting state is visible, so it is
 * fail-safe against a missing trigger and honors reduced motion automatically.
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useInViewReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-y": `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
