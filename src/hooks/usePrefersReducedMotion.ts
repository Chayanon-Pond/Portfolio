"use client";

import { useEffect, useState } from "react";

/**
 * Single source of truth for reduced-motion. Every heavy animation
 * (smooth scroll, blob rotation, parallax, scrubbed reveals) reads this
 * and degrades to simple fades / static output when true.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
