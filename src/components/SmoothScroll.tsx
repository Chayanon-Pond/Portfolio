"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { registerLenis } from "@/lib/scroll";

/**
 * Drives Lenis smooth scroll and wires it to GSAP ScrollTrigger so scroll-
 * scrubbed animations stay perfectly in sync (no double-rAF stutter).
 * Under prefers-reduced-motion we skip Lenis entirely and let the browser
 * scroll natively, while still registering ScrollTrigger for simple fades.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
      smoothWheel: true,
    });

    // Lenis is the single source of truth: it updates ScrollTrigger on scroll,
    // and GSAP's ticker drives Lenis' rAF loop.
    lenis.on("scroll", ScrollTrigger.update);

    // Expose the instance so programmatic scrolls (ring, page transition) route
    // through Lenis and stay in sync instead of fighting the smooth-scroll loop.
    registerLenis(lenis);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    // Trigger positions can be stale while the loader locks the scroll and web
    // fonts are still swapping in (both shift layout). Re-measure once each of
    // those settles so reveals fire at the right scroll positions.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("loader:done", refresh);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      registerLenis(null);
      window.removeEventListener("loader:done", refresh);
    };
  }, [reduced]);

  return <>{children}</>;
}
