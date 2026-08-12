"use client";

import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";
import TerminalMock from "@/components/TerminalMock";

const CARDS = [
  { k: "Available", v: "Open to full-stack & backend roles" },
  { k: "Active", v: "2024 → present" },
  { k: "Based in", v: "Bangkok, Thailand" },
];

export default function Build() {
  return (
    <section
      id="build"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-12 md:py-24 lg:py-36"
    >
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Left — the pitch, slides in from the left */}
        <SplitReveal from="left">
          <p className="eyebrow mb-6">
            What I build · Full-stack development
          </p>
          <Reveal
            as="h2"
            split="words"
            className="max-w-[16ch] text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            lines={[
              <>
                Real systems, <span className="hl">not demos.</span>
              </>,
            ]}
          />
          <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted md:text-lg">
            I build production software teams rely on every day — warehouse &amp;
            order-management systems, IoT telemetry, and web products. Clear UI,
            reliable APIs, and features designed around real workflows.
          </p>
          <div className="mt-8 border-l-2 border-accent pl-5">
            <p className="eyebrow mb-2">Current focus</p>
            <p className="max-w-[46ch] text-base text-foreground/90 md:text-lg">
              Enterprise WMS/OMS platforms on a Go + Vue stack; real-time IoT with
              fail-safe control.
            </p>
          </div>
        </SplitReveal>

        {/* Right — the abstract system view + info cards, slides in from the right */}
        <SplitReveal from="right" delay={0.08}>
          <TerminalMock />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {CARDS.map((c) => (
              <div
                key={c.k}
                className="rounded-xl border border-line p-4 transition-colors hover:border-accent/50"
              >
                <p className="eyebrow mb-2">{c.k}</p>
                <p className="text-sm text-foreground">{c.v}</p>
              </div>
            ))}
          </div>
        </SplitReveal>
      </div>
    </section>
  );
}
