"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SESSION_KEY = "cp-loader-seen";

/**
 * First-visit loader. Masks font + hero readiness, runs once per session
 * (sessionStorage), and is capped at ~1.5s so it never becomes vanity.
 */
export default function Loader() {
  const [active, setActive] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // Intentionally deferred to after hydration: the server has no
    // sessionStorage, so the first client render must also be `null` (inactive)
    // to avoid a hydration mismatch. We only reveal the loader once we've
    // confirmed this session hasn't seen it yet.
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = root.current;
    if (!el) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      document.documentElement.style.overflow = "";
      setActive(false);
      // Let ScrollTrigger re-measure now that the scroll lock is released and
      // the real layout is on screen.
      window.dispatchEvent(new Event("loader:done"));
    };

    if (reduced) {
      const t = window.setTimeout(finish, 400);
      return () => window.clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".loader-mono", { yPercent: 110, duration: 0.7, stagger: 0.06 })
        .fromTo(
          ".loader-bar-fill",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
          "-=0.4"
        )
        .to(".loader-line", { opacity: 1, duration: 0.3 }, "-=0.5");

      // Wait for fonts (bounded) then curtain out — total stays ~1.5s.
      const ready = (
        document.fonts?.ready ?? Promise.resolve()
      ) as Promise<unknown>;
      const minTime = new Promise((r) => setTimeout(r, 1100));

      Promise.all([ready, minTime]).then(() => {
        gsap
          .timeline({ onComplete: finish })
          .to(".loader-inner", { yPercent: -20, opacity: 0, duration: 0.5, ease: "power2.in" })
          .to(el, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, "-=0.2");
      });
    }, el);

    // Hard cap safety net.
    const cap = window.setTimeout(finish, 2600);

    return () => {
      ctx.revert();
      window.clearTimeout(cap);
      document.documentElement.style.overflow = "";
    };
  }, [active, reduced]);

  if (!active) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
      role="status"
      aria-label="Loading"
    >
      <div className="loader-inner flex flex-col items-center gap-6 px-8">
        <div className="flex items-baseline gap-1 overflow-hidden font-mono text-4xl font-semibold tracking-tight sm:text-6xl">
          <span className="loader-mono inline-block">C</span>
          <span className="loader-mono inline-block hl">P</span>
        </div>
        <div className="relative h-px w-40 overflow-hidden bg-line sm:w-56">
          <div className="loader-bar-fill absolute inset-0 origin-left bg-accent" />
        </div>
        <span className="loader-line font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted opacity-0">
          Chayanon Pond
        </span>
      </div>
    </div>
  );
}
