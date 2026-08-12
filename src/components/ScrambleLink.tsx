"use client";

import Link from "next/link";
import { useScramble } from "@/hooks/useScramble";

type Props = {
  href: string;
  label: string;
  className?: string;
};

/**
 * Nav link whose label runs the decode/scramble effect on hover and keyboard
 * focus. The scramble handlers live on the link itself so focus (which doesn't
 * bubble) is captured correctly; the visible text is a nested span the hook
 * writes into. Under reduced motion the hook no-ops and the label stays static.
 *
 * Absolute hrefs (starting with `/`) render as a Next `<Link>` so they perform
 * a client route change (e.g. Home → `/`); in-page anchors (`#work`) stay plain
 * `<a>` for native scroll with the global `scroll-padding-top`.
 */
export default function ScrambleLink({ href, label, className }: Props) {
  const { ref, scramble } = useScramble(label);
  const inner = <span ref={ref}>{label}</span>;

  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className={className}
        data-cursor=""
        onMouseEnter={scramble}
        onFocus={scramble}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      data-cursor=""
      onMouseEnter={scramble}
      onFocus={scramble}
    >
      {inner}
    </a>
  );
}
