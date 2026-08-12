export type Tech = { label: string; src?: string };

/** Colored SVGs bundled locally under /public/logos (sourced from devicon). */
const L = (name: string) => `/logos/${name}.svg`;

/** Grouped stack lists (left column). Items without a bundled logo fall back
 *  to a small accent dot in the UI. */
export const stackGroups: { label: string; items: Tech[] }[] = [
  {
    label: "Core",
    items: [
      { label: "React", src: L("react") },
      { label: "Next.js", src: L("nextjs") },
      { label: "TypeScript", src: L("typescript") },
      { label: "Vue 3", src: L("vuejs") },
      { label: "Go", src: L("go") },
      { label: "Node.js", src: L("nodejs") },
      { label: "Docker", src: L("docker") },
    ],
  },
  {
    label: "Backend & Data",
    items: [
      { label: "Nest.js", src: L("nestjs") },
      { label: "Express", src: L("express") },
      { label: "PostgreSQL", src: L("postgresql") },
      { label: "MySQL", src: L("mysql") },
      { label: "MongoDB", src: L("mongodb") },
      { label: "MS SQL Server", src: L("microsoftsqlserver") },
      { label: "Supabase", src: L("supabase") },
    ],
  },
  {
    label: "Also used",
    items: [
      { label: "Tailwind", src: L("tailwindcss") },
      { label: "Chakra UI" },
      { label: "daisyUI" },
      { label: "NextAuth" },
      { label: "Gin" },
      { label: "Fiber" },
      { label: "Git / GitHub", src: L("github") },
      { label: "Postman", src: L("postman") },
    ],
  },
];

/** The floating, draggable cluster (right column) — recognizable colored logos. */
export const clusterLogos: Tech[] = [
  { label: "React", src: L("react") },
  { label: "Next.js", src: L("nextjs") },
  { label: "Vue 3", src: L("vuejs") },
  { label: "Go", src: L("go") },
  { label: "Node.js", src: L("nodejs") },
  { label: "Nest.js", src: L("nestjs") },
  { label: "TypeScript", src: L("typescript") },
  { label: "Express", src: L("express") },
  { label: "PostgreSQL", src: L("postgresql") },
  { label: "MySQL", src: L("mysql") },
  { label: "MongoDB", src: L("mongodb") },
  { label: "Docker", src: L("docker") },
  { label: "Tailwind", src: L("tailwindcss") },
];
