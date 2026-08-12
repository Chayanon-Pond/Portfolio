import type Lenis from "lenis";

/**
 * Shared scroll bridge. `SmoothScroll` owns the single Lenis instance and
 * registers it here on mount (and clears it on unmount / under reduced motion,
 * where Lenis is never created). Any component that needs to programmatically
 * scroll — the scroll-progress ring, the "VIEW PORTFOLIO" transition — routes
 * through `scrollToTarget` so it always cooperates with Lenis when present and
 * degrades to the native scroll otherwise.
 */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

type ScrollOpts = {
  /** Jump with no animation (used under reduced motion or beneath a cover). */
  immediate?: boolean;
};

/** Resolve a selector / number to an absolute document Y offset. */
function resolveTop(target: number | string): number {
  if (typeof target === "number") return target;
  const el = document.querySelector(target);
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * Smooth-scroll to a number (px), a selector, or an element. Prefers the live
 * Lenis instance so it stays perfectly in sync with the smooth-scroll system;
 * falls back to the native API when Lenis isn't running (e.g. reduced motion).
 */
export function scrollToTarget(target: number | string, opts: ScrollOpts = {}) {
  if (lenis) {
    lenis.scrollTo(target, {
      immediate: opts.immediate,
      duration: opts.immediate ? 0 : 1.1,
      offset: 0,
    });
    return;
  }

  window.scrollTo({
    top: resolveTop(target),
    behavior: opts.immediate ? "auto" : "smooth",
  });
}

/**
 * Dispatch the full-screen wipe transition toward a route: PageTransition
 * covers the viewport, pushes `href` (next/navigation), then uncovers once the
 * new page has mounted.
 */
export function navigateWithTransition(href: string) {
  window.dispatchEvent(
    new CustomEvent("portfolio:navigate", { detail: { href } })
  );
}
