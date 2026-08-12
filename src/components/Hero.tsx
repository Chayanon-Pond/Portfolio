"use client";

import Link from "next/link";
import HeroCanvas from "@/components/three/HeroCanvas";
import FloatingCircles from "@/components/FloatingCircles";
import Reveal from "@/components/Reveal";
import FadeIn from "@/components/FadeIn";
import HeroHeadline from "@/components/HeroHeadline";
import PortfolioCTA from "@/components/PortfolioCTA";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-16 pt-28 md:px-12 md:pb-24 md:pt-32"
    >
      {/* Soft accent glow behind the blob for depth */}
      <div className="hero-glow" aria-hidden />

      <HeroCanvas />

      {/* Decorative physics circles — layered above the blob, below the z-10
          copy/CTA so they never intercept interactive clicks. */}
      <FloatingCircles />

      {/* Soft vignette so the type always wins over the blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 45%, rgba(10,10,11,0) 0%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.9) 100%)",
        }}
      />

      {/* pointer-events:none so empty areas fall through to the grabbable blob
          behind; interactive children re-enable pointer events on themselves. */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1400px]">
        <p className="eyebrow mb-8 hero-rise" style={{ animationDelay: "0.2s" }}>
          Full-Stack Developer · Go · Vue · Next.js
        </p>

        <HeroHeadline />

        {/* Home intro narrative — the lead + the real "I ship…" story, now the
            introduction on the first screen (moved up from the old About). */}
        <Reveal
          as="p"
          delay={0.35}
          className="mt-10 max-w-[40ch] text-[clamp(1.15rem,2.1vw,1.8rem)] font-light leading-snug text-muted"
          lines={[
            <>
              I ship <span className="hl">real production software</span>
            </>,
            <>
              <span className="text-foreground">— not demos.</span> Systems built
              to last.
            </>,
          ]}
        />

        <FadeIn delay={0.5}>
          <div className="mt-10 max-w-[56ch] space-y-5 text-base leading-relaxed text-muted md:text-lg">
            <p>
              I&apos;m a full-stack developer focused on backends that stay
              correct under pressure and front ends that feel effortless. My work
              centres on enterprise-grade platforms: warehouse and order-management
              systems, IoT telemetry, and web products — with a strong Go backbone
              and production-grade Vue and Next.js on the front.
            </p>
            <p>
              I care about the parts users never see: data integrity, safe
              automation with fail-safe fallbacks, and traceability that survives
              an audit. I&apos;d rather build something maintainable for five years
              than flashy for five minutes.
            </p>
          </div>
        </FadeIn>

        <div
          className="hero-fade pointer-events-auto mt-14 flex flex-col items-start gap-7"
          style={{ animationDelay: "0.9s" }}
        >
          <PortfolioCTA playOnMount />
          <Link
            href="/home#contact"
            data-cursor=""
            className="link-wipe inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-foreground"
          >
            Get in touch <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>

      {/* Scroll cue — CSS-driven so it can never get stuck hidden and is
          neutralised (static, still visible) under reduced motion. */}
      <div
        aria-hidden
        className="hero-fade absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ animationDelay: "1.3s" }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-line p-1.5">
          <span className="cue-dot block h-2 w-1 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
