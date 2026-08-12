"use client";

import { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";

/**
 * A monochrome brand SVG (bundled locally under /public/logos) tinted to its
 * brand color via CSS `mask` — so it stays a crisp, colored mark on the dark
 * theme with no runtime network. Sits in a small dark chip so light marks
 * (Copilot) stay visible too.
 */
function AiLogo({
  src,
  color,
  label,
}: {
  src: string;
  color: string;
  label: string;
}) {
  return (
    <span
      title={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white/5 md:h-12 md:w-12"
    >
      <span
        aria-hidden
        className="block h-6 w-6"
        style={
          {
            backgroundColor: color,
            WebkitMaskImage: `url(${src})`,
            maskImage: `url(${src})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          } as CSSProperties
        }
      />
    </span>
  );
}

const MODELS = [
  {
    src: "/logos/openai.svg",
    color: "#10a37f",
    name: "ChatGPT",
    role: "Coding · Ideas · System guidance",
    desc: "Main assistant for system design, generating backend/frontend code, technical brainstorming, and refining UI/UX copy.",
  },
  {
    src: "/logos/gemini.svg",
    color: "#8e75f8",
    name: "Gemini",
    role: "Logic · Math · Structured thinking",
    desc: "For strict step-by-step reasoning, mathematics, algorithms, and validating complex data flows.",
  },
  {
    src: "/logos/claude.svg",
    color: "#d97757",
    name: "Claude",
    role: "Long-form coding · Refactoring",
    desc: "Best for large files and deep refactors — controllers, service layers, and long, structured, maintainable code.",
  },
  {
    src: "/logos/deepseek.svg",
    color: "#4d6bfe",
    name: "Deepseek",
    role: "Backend · Logic · Statistics",
    desc: "Backend-oriented work: query design, Go/backend optimization, and statistical reasoning.",
  },
  {
    src: "/logos/copilot.svg",
    color: "#e6e6e6",
    name: "GitHub Copilot",
    role: "Inline fixes · Refactor · Optimize",
    desc: "Lives in the editor — autocomplete, small fixes, refactors, and clean-up.",
  },
];

const NOTES = [
  {
    label: "AI-driven development",
    body: "I treat AI as a core development partner — from architecting complex systems to writing scalable, clean code — to accelerate delivery while keeping high engineering standards.",
  },
  {
    label: "Learning & collaboration",
    body: "Beyond code generation, I use AI to break down new technologies and compare best practices — a human-in-the-loop process that deepens my technical reasoning.",
  },
  {
    label: "Multi-model strategy",
    body: "A strategic mix: ChatGPT for high-level architecture and schema design, Gemini and Deepseek for backend logic and debugging, and Claude for long-form refactoring and readability.",
  },
  {
    label: "Why multi-AI works better",
    body: "No single model is a silver bullet. Combining strengths means stronger logic, fewer mistakes, and faster iteration.",
  },
];

export default function AiStack() {
  return (
    <section
      id="ai"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-12 md:py-24 lg:py-36"
    >
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {/* Left — the toolchain, slides in from the left */}
        <div>
          <SplitReveal from="left">
            <p className="eyebrow mb-6">AI · Toolchain · Daily use</p>
            <Reveal
              as="h2"
              split="words"
              className="text-[clamp(2rem,5vw,4.25rem)] font-semibold uppercase leading-[1.02] tracking-[-0.02em]"
              lines={[
                <>How I use</>,
                <>
                  <span className="hl">multiple AI.</span>
                </>,
              ]}
            />
            <p className="mt-8 max-w-[48ch] text-base leading-relaxed text-muted md:text-lg">
              Each model plays a different role — I use them as specialists, not
              one big tool. Some focus on code, some on reasoning, some on backend
              logic, some on refactoring and polish.
            </p>
          </SplitReveal>

          <div className="mt-10">
            {MODELS.map((m, i) => (
              <SplitReveal key={m.name} from="left" delay={i * 0.06}>
                <div className="flex items-start gap-4 border-t border-line py-5">
                  <AiLogo src={m.src} color={m.color} label={m.name} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {m.name}
                      </h3>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-accent">
                        {m.role}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {m.desc}
                    </p>
                  </div>
                </div>
              </SplitReveal>
            ))}
          </div>
        </div>

        {/* Right — the philosophy, each note slides in from the right */}
        <div className="md:pt-2">
          {NOTES.map((n, i) => (
            <SplitReveal key={n.label} from="right" delay={i * 0.06}>
              <div className="border-t border-line py-6">
                <p className="eyebrow mb-3">{n.label}</p>
                <p className="max-w-[52ch] text-base leading-relaxed text-muted md:text-lg">
                  {n.body}
                </p>
              </div>
            </SplitReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
