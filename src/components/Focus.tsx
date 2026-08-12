"use client";

import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";

const PRINCIPLES = [
  {
    n: "01",
    title: "Data integrity",
    body: "Correct under pressure — validation, transactions, and invariants that hold when it matters.",
  },
  {
    n: "02",
    title: "AI & automation",
    body: "Exploring AI and machine learning to automate real workflows — intelligent automation and ML-assisted features that make systems smarter.",
  },
  {
    n: "03",
    title: "Traceability",
    body: "Every action leaves a trail — logs and state you can reconstruct and that survive an audit.",
  },
  {
    n: "04",
    title: "Maintainable for years",
    body: "Built to last five years, not to look flashy for five minutes. Clear code over cleverness.",
  },
];

export default function Focus() {
  return (
    <section
      id="focus"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-12 md:py-24 lg:py-36"
    >
      <SplitReveal from="left">
        <p className="eyebrow mb-6">How I work</p>
        <Reveal
          as="h2"
          split="words"
          className="max-w-[18ch] text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          lines={[
            <>
              What I <span className="hl">care about.</span>
            </>,
          ]}
        />
      </SplitReveal>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <SplitReveal
            key={p.n}
            from={i % 2 === 0 ? "left" : "right"}
            delay={(i % 2) * 0.06}
          >
            <div className="h-full rounded-2xl border border-line p-7 transition-colors hover:border-accent/50 md:p-9">
              <span className="font-mono text-sm text-accent">{p.n}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight md:text-2xl">
                {p.title}
              </h3>
              <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          </SplitReveal>
        ))}
      </div>

      <SplitReveal from="left" delay={0.05}>
        <p className="mt-12 border-t border-line pt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          KMUTNB 2020–2024
          <span className="mx-2 text-accent">·</span>
          TechUp Full-Stack Bootcamp 2025
          <span className="mx-2 text-accent">·</span>
          Enterprise WMS/OMS
        </p>
      </SplitReveal>
    </section>
  );
}
