"use client";

import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function Work() {
  return (
    <section
      id="work"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-12 md:py-28 lg:py-40"
    >
      <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-8">My portfolio</p>
          <Reveal
            as="h2"
            split="words"
            className="max-w-[18ch] text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
            lines={[
              <>
                See my <span className="hl">works.</span>
              </>,
            ]}
          />
        </div>
        <p className="max-w-[28ch] text-sm text-muted md:text-right">
          Four projects spanning IoT, learning platforms, and full-stack web —
          each live and open-source.
        </p>
      </div>

      <div className="flex flex-col gap-16 md:gap-24 lg:gap-36">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
