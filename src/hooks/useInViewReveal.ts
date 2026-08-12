"use client";

import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Reveal-on-scroll driven by a persistent IntersectionObserver + CSS classes.
 * The animation REPLAYS every time the element re-enters the viewport: it plays
 * in on enter and re-arms (hides) once it has fully scrolled out, so the next
 * entry animates again.
 *
 * Fail-safe design: the element's default (CSS) state is fully VISIBLE. The hook
 * only adds `.is-armed` (hidden) while the element is OUT of view, and the
 * observer is guaranteed to reveal it on the next enter. So if JS never runs, IO
 * is unavailable, or the user prefers reduced motion, the element simply stays
 * visible — and an element that is currently in view is never left hidden.
 *
 * Flicker/thrash guards: rootMargin/threshold are set so re-arming only happens
 * once the element is FULLY off-screen (enter fires on first pixel, leave fires
 * when completely gone), and an `inView` latch means each crossing toggles once.
 */
export function useInViewReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      // Leave the element in its visible resting state (no replay).
      return;
    }

    let inView = false;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (inView) return;
          inView = true;
          // Restart the CSS animation: drop `.is-in`, force reflow, re-add it.
          el.classList.remove("is-armed");
          el.classList.remove("is-in");
          void el.offsetWidth; // reflow so the animation restarts each entry
          el.classList.add("is-in");
        } else {
          if (!inView) return;
          inView = false;
          // Re-arm (hide) — only ever while fully off-screen.
          el.classList.remove("is-in");
          el.classList.add("is-armed");
        }
      },
      // Enter on first pixel; leave only once fully gone → no partial-view blink.
      { rootMargin: "0px", threshold: 0 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      // Restore the visible resting state so nothing is ever left hidden.
      el.classList.remove("is-armed", "is-in");
    };
  }, []);

  return ref;
}
