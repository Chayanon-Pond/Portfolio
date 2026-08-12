"use client";

import { CSSProperties, ReactNode } from "react";
import { useInViewReveal } from "@/hooks/useInViewReveal";

/**
 * Directional slide-in reveal. Left columns enter from the left, right columns
 * from the right, converging to their resting position on scroll-in (masked
 * translate + fade, site --ease-expo). Built on the same fail-safe
 * IntersectionObserver mechanism as FadeIn: the resting state is fully visible,
 * so if the observer never fires (or under reduced motion) the content just
 * shows — no code path leaves it hidden.
 */
export default function SplitReveal({
  from = "left",
  children,
  delay = 0,
  distance = 64,
  className,
}: {
  from?: "left" | "right";
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const ref = useInViewReveal<HTMLDivElement>();
  const x = from === "left" ? -distance : distance;

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={
        {
          "--reveal-x": `${x}px`,
          "--reveal-y": "0px",
          "--reveal-delay": `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
