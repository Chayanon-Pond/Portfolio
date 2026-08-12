"use client";

import {
  Children,
  ElementType,
  isValidElement,
  ReactNode,
  useRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

type RevealProps = {
  /** Each entry becomes one masked line that slides up on scroll. */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /**
   * "lines" (default): each line rises as one masked block.
   * "words": each word within a line gets its own clip-mask and rises with a
   * finer stagger so words "settle together" — used for headlines.
   */
  split?: "lines" | "words";
};

type TagProps = {
  className?: string;
  children?: ReactNode;
  ref?: React.Ref<HTMLElement>;
};

/** A single clip-masked word that rises from below. */
function WordMask({ children }: { children: ReactNode }) {
  return (
    <span className="word-mask">
      <span className="word-inner">{children}</span>
    </span>
  );
}

/**
 * Split a line's ReactNode into per-word masks. Plain strings split on spaces;
 * embedded elements (e.g. the green `.hl` span) are kept intact as a single
 * word unit so their styling survives. Spaces are preserved as breakable text
 * so the headline still wraps responsively.
 */
function toWords(line: ReactNode, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  Children.toArray(line).forEach((child, ci) => {
    if (typeof child === "string") {
      child.split(/(\s+)/).forEach((part, pi) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          out.push(<span key={`${keyBase}-sp-${ci}-${pi}`}> </span>);
        } else {
          out.push(<WordMask key={`${keyBase}-w-${ci}-${pi}`}>{part}</WordMask>);
        }
      });
    } else if (isValidElement(child)) {
      out.push(<WordMask key={`${keyBase}-el-${ci}`}>{child}</WordMask>);
    } else {
      out.push(child);
    }
  });
  return out;
}

/**
 * Editorial reveal. Lines (or words) are clipped and their inner spans rise
 * from translateY(110%) → 0 with a staggered expo ease when the block scrolls
 * into view (or on mount if already above the fold). Reduced motion → instant.
 * Fail-safe: the resting state is visible, so if the trigger never fires the
 * text still shows.
 */
export default function Reveal({
  lines,
  as = "div",
  className,
  lineClassName,
  delay = 0,
  split = "lines",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const Tag = as as React.ComponentType<TagProps>;
  const words = split === "words";

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inners = el.querySelectorAll<HTMLElement>(
      words ? ".word-inner" : ".line-inner"
    );
    if (reduced) {
      gsap.set(inners, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Words rise as a pure masked translate (crisp, "not just a fade"); lines
      // keep the softer translate + fade. `immediateRender:false` keeps the
      // elements in their VISIBLE resting state until the trigger fires — so if
      // ScrollTrigger never runs, nothing is left hidden (fail-safe).
      const tween = gsap.fromTo(
        inners,
        { yPercent: 110, ...(words ? {} : { opacity: 0 }) },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: "expo.out",
          stagger: words ? 0.045 : 0.09,
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            // Enter on first touch; leave/reset only once fully off-screen so a
            // slow scroll never blinks. Replays on every (re)entry.
            start: "top bottom",
            end: "bottom top",
            toggleActions: "restart reset restart reset",
          },
        }
      );

      // Above the fold at load: ScrollTrigger won't fire onEnter for a start
      // that's already passed at scrollY:0, so play it once on mount. It can
      // never be left hidden at the top.
      const startLine = window.innerHeight * 0.85;
      if (el.getBoundingClientRect().top < startLine) {
        tween.play(0);
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, words]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {lines.map((line, i) =>
        words ? (
          <span key={i} className={`reveal-line ${lineClassName ?? ""}`}>
            {toWords(line, `l${i}`)}
          </span>
        ) : (
          <span key={i} className={`line-mask ${lineClassName ?? ""}`}>
            <span className="line-inner">{line}</span>
          </span>
        )
      )}
    </Tag>
  );
}
