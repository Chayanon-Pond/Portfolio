"use client";

import Link from "next/link";
import HeroHeadline from "@/components/HeroHeadline";
import FadeIn from "@/components/FadeIn";

/**
 * `/home` hero — sits under the sticky nav. Same word-rise headline as the
 * intro, but the green identity word auto-rotates between "Chayanon Pond" and
 * "a Developer". No blob/physics here — a clean, focused portfolio hero.
 */
export default function HomeHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[86svh] flex-col justify-center overflow-hidden px-6 pb-16 pt-28 md:px-12 md:pb-20 md:pt-44"
    >
      <div className="hero-glow" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <p className="eyebrow mb-8 hero-rise" style={{ animationDelay: "0.15s" }}>
          Full-Stack Developer · Go · Vue · Next.js
        </p>

        <HeroHeadline words={["Chayanon Pond", "a Developer"]} />

        <FadeIn delay={0.3}>
          <p className="mt-10 max-w-[52ch] text-lg leading-relaxed text-muted md:text-xl">
            Full-stack developer building production systems — Go, Vue, and
            Next.js — that teams rely on every day.
          </p>
        </FadeIn>

        <div
          className="hero-fade mt-12 flex flex-wrap items-center gap-5"
          style={{ animationDelay: "0.7s" }}
        >
          <Link
            href="#work"
            data-cursor="View"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm font-medium text-[#05130a] transition-transform duration-300 hover:-translate-y-0.5"
          >
            See my work
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </Link>
          <Link
            href="#contact"
            data-cursor=""
            className="link-wipe inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-foreground"
          >
            Get in touch <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
