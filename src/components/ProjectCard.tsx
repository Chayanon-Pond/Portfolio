"use client";

import { CSSProperties, useState } from "react";
import type { Project } from "@/lib/projects";
import { tagColor } from "@/lib/projects";
import { useInViewReveal } from "@/hooks/useInViewReveal";

export default function ProjectCard({ project }: { project: Project }) {
  const ref = useInViewReveal<HTMLElement>();
  // Screenshot is optional and may 404 until the boss adds the PNG — on any
  // load error we hide the <img> and fall back to the CSS gradient below it.
  const [imgOk, setImgOk] = useState(true);

  return (
    <article
      ref={ref}
      className="reveal group relative"
      style={{ "--reveal-y": "40px" } as CSSProperties}
    >
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="View →"
        className="block"
      >
        {/* Visual field — screenshot over a gradient fallback, both zoom on hover */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line transition-colors duration-500 group-hover:border-white/20">
          {/* Base layer: CSS gradient — always present, shown when there is no
              screenshot or the image fails to load (no broken-image icon). */}
          <div
            aria-hidden
            className="absolute inset-0 scale-105 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-110"
            style={{ background: project.gradient }}
          />
          {/* Screenshot on top; removed from the DOM on error → gradient shows. */}
          {project.image && imgOk && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              onError={() => setImgOk(false)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-105"
            />
          )}
          {/* Bottom scrim keeps the title legible over the image/gradient */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background:
                "linear-gradient(to top, rgba(4,8,6,0.72) 0%, rgba(4,8,6,0.28) 45%, transparent 100%)",
            }}
          />
          {/* Index watermark */}
          <span className="absolute left-6 top-5 font-mono text-sm text-white/60">
            {project.index}
          </span>
          {/* Title slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-none tracking-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
              {project.title}
            </h3>
            <p className="mt-2 max-w-[42ch] text-sm text-white/70 md:text-base">
              {project.tagline}
            </p>
          </div>
        </div>
      </a>

      {/* Details below the card */}
      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="space-y-3 text-sm leading-relaxed text-muted md:text-[0.95rem]">
            <p>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground/70">
                Problem —{" "}
              </span>
              {project.problem}
            </p>
            <p>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground/70">
                Built —{" "}
              </span>
              {project.built}
            </p>
            <p>
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Impact —{" "}
              </span>
              {project.impact}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5 md:col-span-4">
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((t, i) => (
              <li
                key={t}
                className="tag-chip rounded-full px-3 py-1 font-mono text-xs"
                style={
                  {
                    "--tag": tagColor(t),
                    transitionDelay: `${i * 30}ms`,
                  } as CSSProperties
                }
              >
                {t}
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor=""
              className="font-mono text-sm text-foreground transition-colors hover:text-accent"
            >
              Live ↗
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor=""
              className="font-mono text-sm text-foreground transition-colors hover:text-accent"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
