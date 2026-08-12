"use client";

import { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";

/** Line icons (stroke = currentColor, inherits the accent color). */
const IconFrontend = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <rect x="4" y="6" width="24" height="17" rx="2" />
    <path d="M4 11h24" strokeLinecap="round" />
    <path d="M12 27h8M16 23v4" strokeLinecap="round" />
    <circle cx="7" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const IconBackend = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <rect x="5" y="5" width="22" height="8" rx="2" />
    <rect x="5" y="19" width="22" height="8" rx="2" />
    <path d="M9 9h.01M9 23h.01" strokeLinecap="round" />
    <path d="M20 9h4M20 23h4" strokeLinecap="round" />
  </svg>
);

const IconDatabase = (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <ellipse cx="16" cy="8" rx="10" ry="4" />
    <path d="M6 8v8c0 2.2 4.5 4 10 4s10-1.8 10-4V8" />
    <path d="M6 16v8c0 2.2 4.5 4 10 4s10-1.8 10-4v-8" />
  </svg>
);

const CARDS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: IconFrontend,
    title: "Frontend Development",
    body: "Modern, responsive UIs with React, Next.js, and Vue 3 + Tailwind — internal tools, dashboards, and polished interactive web apps.",
  },
  {
    icon: IconBackend,
    title: "Backend & API Design",
    body: "Reliable services and APIs in Go (Gin/Fiber) and Node/Nest.js — clean business logic, integrations, and architectures that hold up in production.",
  },
  {
    icon: IconDatabase,
    title: "Database & DevOps",
    body: "Schema design and query tuning across PostgreSQL, MySQL, MongoDB & MS SQL, with Docker and dependable deployments. Data integrity first.",
  },
];

export default function Expertise() {
  return (
    <section
      id="expertise"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-12 md:py-24 lg:py-36"
    >
      <SplitReveal from="left">
        <p className="eyebrow mb-6">My services</p>
        <Reveal
          as="h2"
          split="words"
          className="text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          lines={[
            <>
              My <span className="hl">Expertise.</span>
            </>,
          ]}
        />
      </SplitReveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <SplitReveal
            key={c.title}
            from={i === 2 ? "right" : "left"}
            delay={i * 0.08}
          >
            <div className="flex h-full flex-col rounded-2xl border border-line p-7 transition-colors hover:border-accent/50 md:p-8">
              <span className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-line text-accent [&>svg]:h-7 [&>svg]:w-7">
                {c.icon}
              </span>
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                {c.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {c.body}
              </p>
            </div>
          </SplitReveal>
        ))}
      </div>
    </section>
  );
}
