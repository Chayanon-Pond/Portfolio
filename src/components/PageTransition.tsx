"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Full-screen wipe overlay that turns the "VIEW PORTFOLIO" CTA into a real
 * route change. On a `portfolio:navigate` event it slides a solid panel up to
 * cover the viewport, pushes the target route (next/navigation), then — once
 * the new page has mounted (pathname change) — slides the panel off the top to
 * reveal it. The panel starts and ends fully off-screen with
 * `pointer-events:none`, so it never traps focus or clicks.
 *
 * Robustness: a re-entrancy guard ignores overlapping triggers, and a safety
 * timeout force-resets the panel so it can never be left covering the screen —
 * even if a navigation stalls. Under reduced motion it skips the wipe and
 * pushes instantly (the shared shell handles the scroll reset either way).
 */
export default function PageTransition() {
  const reduced = usePrefersReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const pendingRef = useRef(false);
  const safetyRef = useRef(0);

  // Cover the screen, then push the route. The uncover is fired from the
  // pathname effect below, once the destination page has actually mounted.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onNavigate = (e: Event) => {
      const href = (e as CustomEvent<{ href?: string }>).detail?.href;
      if (!href) return;

      if (reduced) {
        router.push(href);
        return;
      }
      if (runningRef.current) return;
      runningRef.current = true;

      gsap.killTweensOf(panel);

      // Hard safety net: whatever happens, the panel is off-screen within 4s.
      window.clearTimeout(safetyRef.current);
      safetyRef.current = window.setTimeout(() => {
        gsap.set(panel, { yPercent: 100, pointerEvents: "none" });
        runningRef.current = false;
        pendingRef.current = false;
      }, 4000);

      gsap
        .timeline()
        .set(panel, { yPercent: 100, pointerEvents: "auto" })
        .to(panel, { yPercent: 0, duration: 0.5, ease: "expo.inOut" })
        .add(() => {
          pendingRef.current = true;
          router.push(href);
        });
    };

    window.addEventListener("portfolio:navigate", onNavigate);
    return () => window.removeEventListener("portfolio:navigate", onNavigate);
  }, [reduced, router]);

  // Destination mounted → reveal it by sliding the cover up and off. A short
  // delay lets the new page paint under the cover first.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (!pendingRef.current) return;
    pendingRef.current = false;

    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(safetyRef.current);
        gsap.set(panel, { yPercent: 100, pointerEvents: "none" });
        runningRef.current = false;
      },
    });
    tl.to(panel, {
      yPercent: -100,
      duration: 0.6,
      ease: "expo.inOut",
      delay: 0.08,
    });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={panelRef}
      aria-hidden
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{
        transform: "translateY(100%)",
        pointerEvents: "none",
        background: "var(--background)",
      }}
    >
      {/* Leading accent edge + mark for a crafted, intentional wipe. */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: "var(--accent)" }}
      />
      <span className="font-mono text-sm uppercase tracking-[0.4em] text-muted">
        Portfolio
      </span>
    </div>
  );
}
