"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrambleLink from "@/components/ScrambleLink";

const LINKS = [
  { href: "/", id: "home", label: "Home" },
  { href: "#expertise", id: "expertise", label: "Expertise" },
  { href: "#about", id: "about", label: "About" },
  { href: "#work", id: "work", label: "Portfolio" },
  { href: "/#stack", id: "stack", label: "Stack" },
  { href: "#contact", id: "contact", label: "Contact" },
];

const GITHUB = "https://github.com/Chayanon-Pond";
// TODO: boss — add the LinkedIn URL; the icon appears automatically once set.
const LINKEDIN: string = "";

/**
 * Fixed/sticky top navigation. Translucent blurred dark bar so content stays
 * readable beneath it; anchors use scroll-margin (globals `scroll-padding-top`)
 * so sections aren't hidden under it. Labels scramble on hover/focus and the
 * active section is highlighted via a cheap IntersectionObserver (fail-safe: no
 * highlight if it never runs). On mobile the link row collapses to a minimal
 * bar (logo + social) — the footer nav covers section links there.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        background: scrolled ? "rgba(10,10,11,0.72)" : "rgba(10,10,11,0.28)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid var(--line)"
          : "1px solid transparent",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 md:px-12"
      >
        <Link
          href="/"
          aria-label="Chayanon Pond — home"
          className="font-mono text-lg font-semibold tracking-tight"
          data-cursor=""
        >
          C<span className="hl">P</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <ScrambleLink
                href={l.href}
                label={l.label}
                className={`link-wipe font-mono text-sm transition-colors ${
                  active === l.id
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            data-cursor=""
            className="-m-2 p-2 text-muted transition-colors hover:text-accent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.556 0-.274-.01-1-.015-1.965-3.196.695-3.87-1.54-3.87-1.54-.523-1.33-1.277-1.684-1.277-1.684-1.044-.714.08-.7.08-.7 1.154.082 1.76 1.185 1.76 1.185 1.026 1.758 2.693 1.25 3.35.955.104-.743.402-1.25.73-1.538-2.552-.29-5.235-1.276-5.235-5.68 0-1.255.448-2.28 1.183-3.084-.119-.29-.513-1.46.112-3.043 0 0 .966-.31 3.165 1.178a11 11 0 0 1 5.762 0c2.198-1.489 3.163-1.178 3.163-1.178.626 1.583.232 2.753.114 3.043.737.804 1.182 1.83 1.182 3.084 0 4.415-2.687 5.386-5.247 5.67.413.356.78 1.057.78 2.13 0 1.538-.014 2.778-.014 3.156 0 .308.207.667.79.554A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
            </svg>
          </a>
          {LINKEDIN ? (
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              data-cursor=""
              className="-m-2 p-2 text-muted transition-colors hover:text-accent"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
