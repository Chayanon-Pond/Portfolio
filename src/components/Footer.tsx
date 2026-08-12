import ScrambleLink from "@/components/ScrambleLink";

// Absolute targets so the footer nav works even when linked from the `/` intro.
const navLinks = [
  { href: "/home#work", label: "Work" },
  { href: "/home#stack", label: "Stack" },
  { href: "/home#about", label: "Experience" },
  { href: "/home#contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-12">
        {/* Primary navigation lives here now that the home view has no top bar. */}
        <nav
          aria-label="Footer"
          className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3"
        >
          <ScrambleLink
            href="/"
            label="Home"
            className="link-wipe font-mono text-sm text-muted transition-colors hover:text-foreground"
          />
          {navLinks.map((l) => (
            <ScrambleLink
              key={l.href}
              href={l.href}
              label={l.label}
              className="link-wipe font-mono text-sm text-muted transition-colors hover:text-foreground"
            />
          ))}
        </nav>

        <div className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-muted md:flex-row md:items-center">
          <span>
            © {year} Chayanon Pond. Built with Next.js, GSAP &amp; three.js.
          </span>
          <span className="uppercase tracking-[0.2em]">
            Designed &amp; developed in Thailand
          </span>
        </div>
      </div>
    </footer>
  );
}
