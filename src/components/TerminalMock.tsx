"use client";

/**
 * Abstract, decorative terminal/dashboard mockup (pure CSS/SVG, aria-hidden).
 * No real logs or identities — just an on-brand impression of a running system:
 * a window chrome, a few mono log lines, and a tiny live-looking bar chart.
 */
const LINES: { t: string; tone?: "muted" | "accent" | "fg" }[] = [
  { t: "$ deploy --env prod --check", tone: "fg" },
  { t: "✓ migrations   up to date", tone: "accent" },
  { t: "✓ health       200 · 42ms", tone: "muted" },
  { t: "→ worker       queue drained", tone: "muted" },
  { t: "✓ api          orders · sync ok", tone: "accent" },
];

const BARS = [42, 68, 55, 80, 61, 73, 48, 88, 64];

export default function TerminalMock() {
  return (
    <div
      aria-hidden
      className="w-full overflow-hidden rounded-2xl border border-line bg-surface"
      style={{ boxShadow: "0 20px 60px -30px rgba(0,0,0,0.8)" }}
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#27c93f" }} />
        <span className="ml-3 font-mono text-xs text-muted">systems · status</span>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-2">
        {/* log column */}
        <div className="flex flex-col gap-2 font-mono text-[0.8rem]">
          {LINES.map((l, i) => (
            <span
              key={i}
              className={
                l.tone === "accent"
                  ? "text-accent"
                  : l.tone === "fg"
                    ? "text-foreground"
                    : "text-muted"
              }
            >
              {l.t}
            </span>
          ))}
          <span className="mt-1 inline-flex items-center gap-1 text-muted">
            <span>uptime</span>
            <span className="text-foreground">99.98%</span>
            <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-accent" />
          </span>
        </div>

        {/* mini chart */}
        <div className="flex flex-col justify-between rounded-xl border border-line p-4">
          <div className="flex items-baseline justify-between font-mono text-xs text-muted">
            <span>throughput</span>
            <span className="text-accent">live</span>
          </div>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {BARS.map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${v}%`,
                  background:
                    i === 7
                      ? "var(--accent)"
                      : "linear-gradient(180deg, rgba(34,224,122,0.55), rgba(34,224,122,0.14))",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
