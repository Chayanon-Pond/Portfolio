"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import { scrollToTarget } from "@/lib/scroll";

/**
 * Persistent client chrome shared by every route. Mounting this once in the
 * root layout keeps Lenis, the loader (session-once), the cursor, grain, the
 * scroll-progress ring and the page-transition wipe alive across client
 * navigations — so `/` and `/home` only render their page-specific content.
 *
 * On each route change it resets scroll (honouring an incoming hash) and
 * re-measures ScrollTrigger so the new page's reveal positions recalc. The
 * work happens on the next frame, after the new page has painted.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    const id = window.requestAnimationFrame(() => {
      if (hash && document.querySelector(hash)) {
        scrollToTarget(hash, { immediate: true });
      } else {
        scrollToTarget(0, { immediate: true });
      }
      ScrollTrigger.refresh();
    });

    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <SmoothScroll>
      <Loader />
      <Cursor />
      <div className="grain" aria-hidden />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {children}
      <ScrollProgress />
      <PageTransition />
    </SmoothScroll>
  );
}
