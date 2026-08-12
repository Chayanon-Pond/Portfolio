# Chayanon Pond — Developer Portfolio

A high-end, single-scroll developer portfolio. Dark theme, emerald-green accent,
huge editorial typography, and crafted motion — a lagging custom cursor, a
distorted 3D hero blob, scroll-triggered line reveals, and smooth scrolling.

## Tech

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**
- **GSAP + ScrollTrigger** — editorial line-mask reveals
- **Lenis** — smooth scroll, wired to ScrollTrigger (single rAF source)
- **Framer Motion** — micro-interactions / stagger
- **React Three Fiber + drei** — one hero blob (`ssr:false`, lazy-loaded)

## Run

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # production build (must pass cleanly)
npm run start    # serve the production build locally
```

## Deploy to Vercel

Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new).
Framework is auto-detected as Next.js — no extra config needed. (Or run `vercel`
from the Vercel CLI.)

## Where to edit contact info

All contact details live in **`src/components/Contact.tsx`**:

- Email + GitHub are pre-filled near the top (the `EMAIL` and `GITHUB` constants).
- **Phone, LinkedIn, and address** are left as commented-out `{/* TODO: boss … */}`
  placeholders inside the "Elsewhere" list — fill in the value and uncomment the
  block. Phone and address are intentionally empty (private data).

Other content:

- **Projects** — `src/lib/projects.ts`
- **Tech stack** — `src/lib/stack.ts`
- **About / education** — `src/components/About.tsx`
- **SEO / site URL** — `src/app/layout.tsx` (`SITE_URL` + `metadata`)

## Structure

```
src/
  app/            layout, page, globals.css (design tokens)
  components/     Hero, About, Work, ProjectCard, Stack, Contact, …
    three/        Scene (Canvas + blob) + HeroCanvas (dynamic ssr:false)
  hooks/          usePrefersReducedMotion, useIsTouch
  lib/            projects, stack data
```

## Accessibility & performance

- Only `transform` / `opacity` are animated.
- `prefers-reduced-motion` disables smooth scroll, blob rotation, parallax, and
  scrubbed reveals (simple fades remain).
- Custom cursor is hidden on touch devices and never replaces keyboard focus.
- One `<Canvas>` (hero only), lazy-loaded with a lower DPR ceiling on mobile.
```
