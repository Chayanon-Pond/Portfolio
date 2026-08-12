"use client";

import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";
import LogoCluster from "@/components/LogoCluster";
import { stackGroups } from "@/lib/techLogos";

/**
 * Stack section for the intro page. Left column: grouped tool lists with small
 * local logos. Right column: a big display headline + the draggable, physics-
 * driven tech-logo cluster. Left slides in from the left, right from the right.
 */
export default function StackIntro() {
  return (
    <section
      id="stack"
      className="relative z-10 scroll-mt-24 border-y border-line py-16 md:py-24 lg:py-36"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12">
        {/* Left — grouped lists */}
        <SplitReveal from="left">
          <p className="eyebrow mb-6">Stack · Languages · Platforms</p>
          <p className="mb-10 max-w-[44ch] text-base leading-relaxed text-muted md:text-lg">
            A focused, well-understood stack — tools I reach for to build systems
            that last.
          </p>

          <div className="flex flex-col gap-9">
            {stackGroups.map((group) => (
              <div key={group.label} className="border-t border-line pt-6">
                <h3 className="eyebrow mb-5">{group.label}</h3>
                <ul className="flex flex-wrap gap-x-5 gap-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item.label}
                      data-cursor=""
                      className="inline-flex items-center gap-2 text-base text-foreground/90 transition-colors hover:text-accent"
                    >
                      {item.src ? (
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[rgba(245,247,245,0.92)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.src}
                            alt=""
                            aria-hidden
                            width={16}
                            height={16}
                            style={{ width: 16, height: 16 }}
                          />
                        </span>
                      ) : (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                      )}
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SplitReveal>

        {/* Right — display headline + draggable logo cluster */}
        <SplitReveal from="right" delay={0.08}>
          <Reveal
            as="h2"
            split="words"
            className="mb-8 text-[clamp(2.5rem,6vw,5.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em]"
            lines={[<>How I build</>]}
          />
          <LogoCluster />
        </SplitReveal>
      </div>
    </section>
  );
}
