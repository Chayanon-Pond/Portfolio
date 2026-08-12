"use client";

import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";

const ENTRIES: { period: string; title: string; sub: string }[] = [
  {
    period: "Present",
    title: "Full-Stack Developer",
    sub: "Enterprise WMS/OMS platforms (Go + Vue) — production internal systems teams rely on every day.",
  },
  {
    period: "2025",
    title: "TechUp — Full-Stack Developer Bootcamp",
    sub: "Intensive full-stack training across modern web, APIs, and databases.",
  },
  {
    period: "2020–2024",
    title: "King Mongkut's University of Technology North Bangkok (KMUTNB)",
    sub: "Undergraduate studies — the foundations of software and systems.",
  },
];

const SKILLS = [
  "Web App Development",
  "API & Backend Architecture",
  "Database Design",
  "Docker & Containerization",
  "Workflow Automation",
];

export default function Timeline() {
  return (
    <section
      id="about"
      className="relative z-10 scroll-mt-24 border-y border-line py-16 md:py-24 lg:py-36"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12">
        {/* Left — vertical timeline (each entry staggers in from the left) */}
        <div>
          <p className="eyebrow mb-8">Education &amp; Experience</p>
          <div className="flex flex-col">
            {ENTRIES.map((e, i) => (
              <SplitReveal key={e.period} from="left" delay={i * 0.08}>
                <div className="flex gap-5">
                  {/* marker column */}
                  <div className="flex flex-col items-center pt-1.5">
                    <span className="h-3 w-3 shrink-0 rounded-full bg-accent ring-4 ring-background" />
                    {i < ENTRIES.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-line" />
                    )}
                  </div>
                  <div className={i < ENTRIES.length - 1 ? "pb-10" : ""}>
                    <span className="font-mono text-sm text-accent">
                      {e.period}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight md:text-xl">
                      {e.title}
                    </h3>
                    <p className="mt-2 max-w-[40ch] text-base leading-relaxed text-muted">
                      {e.sub}
                    </p>
                  </div>
                </div>
              </SplitReveal>
            ))}
          </div>
        </div>

        {/* Right — identity + skills (slides in from the right) */}
        <SplitReveal from="right" delay={0.08}>
          <Reveal
            as="h2"
            split="words"
            className="text-[clamp(1.9rem,4.4vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
            lines={[
              <>
                I&apos;m <span className="hl">Chayanon Pond</span>
              </>,
              <>— Full-Stack Developer.</>,
            ]}
          />
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted md:text-lg">
            I build backends that stay correct under pressure and front ends that
            feel effortless — with data integrity and fail-safe automation at the
            core.
          </p>

          <div className="mt-10 border-t border-line pt-6">
            <p className="eyebrow mb-5">Skills</p>
            <ul className="flex flex-wrap gap-2.5">
              {SKILLS.map((s) => (
                <li
                  key={s}
                  data-cursor=""
                  className="rounded-full border border-line px-4 py-2 font-mono text-xs text-foreground/90 transition-colors hover:border-accent hover:text-accent"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </SplitReveal>
      </div>
    </section>
  );
}
