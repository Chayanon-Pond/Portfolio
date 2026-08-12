export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  problem: string;
  built: string;
  impact: string;
  tags: string[];
  live: string;
  repo: string;
  /** Local screenshot under /public/projects. May be absent — the card falls
   *  back to `gradient` if the file is missing or fails to load. */
  image?: string;
  /** CSS gradient used as the card's visual field (no external images needed). */
  gradient: string;
};

/**
 * Brand colors for the tech tags (tinted in on card hover). Very dark brands are
 * lightened so they stay readable on the near-black background; anything not in
 * the map falls back to the green accent.
 */
const TAG_COLORS: Record<string, string> = {
  "Next.js": "#ffffff",
  React: "#61dafb",
  Vue: "#42b883",
  "Vue 3": "#42b883",
  TypeScript: "#4a9bef", // lightened #3178C6
  JavaScript: "#f7df1e",
  Vite: "#8b8bff", // lightened #646CFF
  Tailwind: "#38bdf8",
  Go: "#00add8",
  "Go + Fiber": "#00add8",
  "Go (Gin)": "#00add8",
  "Go (Fiber)": "#00add8",
  Fiber: "#00add8",
  Gin: "#00add8",
  "Node.js": "#83cd29",
  "Node/Express": "#83cd29",
  Express: "#83cd29",
  "Nest.js": "#ff3d6e", // lightened #E0234E
  PostgreSQL: "#6e8bff", // lightened #4169E1
  MySQL: "#5b93c4", // lightened #4479A1
  MongoDB: "#5fbf63", // lightened #47A248
  "MS SQL Server": "#d16b6b",
  Supabase: "#3ecf8e",
  Docker: "#2496ed",
  Prisma: "#7c8aea",
  JWT: "#fb6090", // lightened #FB015B
  Auth: "#22e07a",
  NextAuth: "#22e07a",
  Cloudinary: "#6d7ef0", // lightened #3448C5
  MQTT: "#c77dc7", // lightened #660066
  IoT: "#22e07a",
  "ERP/WMS integration": "#22e07a",
};

/** Brand color for a tag, defaulting to the green accent. */
export function tagColor(tag: string): string {
  return TAG_COLORS[tag] ?? "#22e07a";
}

export const projects: Project[] = [
  {
    id: "greenhouse-iot",
    index: "01",
    title: "Greenhouse IoT",
    tagline: "Digital-twin greenhouse monitoring & fail-safe control",
    problem:
      "Growers needed real-time visibility and safe automation across multiple greenhouse zones, with health status they can trust.",
    built:
      "A digital-twin platform: per-zone (site) monitoring over WebSocket + MQTT telemetry, health status computed from live readings vs setpoints, with safe automated control and a fail-safe fallback.",
    impact:
      "Live sensor-to-action control across 5+ zones with deterministic safety behaviour and end-to-end lot traceability into ERP/WMS.",
    tags: ["Go (Gin)", "React", "Tailwind", "WebSocket", "MQTT", "IoT", "JWT"],
    live: "https://greenhouse-iot-kappa.vercel.app/",
    repo: "https://github.com/Chayanon-Pond/greenhouse-iot",
    image: "/projects/greenhouse-iot.svg",
    gradient:
      "radial-gradient(120% 120% at 15% 15%, rgba(34,224,122,0.55) 0%, rgba(34,224,122,0) 45%), linear-gradient(135deg, #0d2a1c 0%, #061410 60%, #04100b 100%)",
  },
  {
    id: "courseflow",
    index: "02",
    title: "CourseFlow",
    tagline: "Full-stack online learning platform",
    problem:
      "Learners and tutors needed one coherent place for structured educational content — courses, progress, and video — without stitching tools together.",
    built:
      "An online learning platform built with Next.js and Supabase: intelligent progress tracking, real-time video monitoring, and sequential learning paths.",
    impact:
      "A complete LMS experience covering the full lifecycle from browsing to enrolled, tracked learning.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "Supabase", "JWT"],
    live: "https://course-flow-xwwf.onrender.com/",
    repo: "https://github.com/Chayanon-Pond/course_flow",
    image: "/projects/courseflow.svg",
    gradient:
      "radial-gradient(120% 120% at 85% 10%, rgba(56,189,248,0.4) 0%, rgba(56,189,248,0) 45%), linear-gradient(135deg, #101a2e 0%, #0a0f1c 60%, #06090f 100%)",
  },
  {
    id: "project-go",
    index: "03",
    title: "PlanStack",
    tagline: "Full-stack task manager with JWT auth",
    problem:
      "A productivity app needed secure accounts and rich task modelling — priorities, due dates, filtering — without feeling heavy.",
    built:
      "JWT-authenticated CRUD with priorities and due dates, filtering and sorting, and a light/dark UI, served by a Go + Fiber API over MongoDB.",
    impact:
      "A fast, secure task workflow demonstrating a clean Go + Fiber backend paired with a modern React front end.",
    tags: ["Go + Fiber", "React", "Next.js", "Tailwind", "JWT"],
    live: "https://project-go-two.vercel.app/",
    repo: "https://github.com/Chayanon-Pond/project-go",
    image: "/projects/project-go.svg",
    gradient:
      "radial-gradient(120% 120% at 20% 85%, rgba(168,85,247,0.42) 0%, rgba(168,85,247,0) 45%), linear-gradient(135deg, #1c1330 0%, #120b1f 60%, #0a0713 100%)",
  },
  {
    id: "side-myproject",
    index: "04",
    title: "Content Publishing Platform",
    tagline: "Content management & article publishing platform",
    problem:
      "Content creators needed more than a blog — structured article publishing with moderation, rich media, and role-based control.",
    built:
      "A CMS built with React and Node.js: user authentication, a real-time notification system, secure file-upload management, and role-based access control for content creators.",
    impact:
      "A production-shaped publishing platform with threaded discussion and end-to-end editorial controls.",
    tags: ["JavaScript", "React", "Tailwind", "Node.js", "Express", "PostgreSQL", "JWT"],
    live: "https://side-my-project-two.vercel.app/",
    repo: "https://github.com/Chayanon-Pond/Side-MyProject",
    image: "/projects/side-myproject.svg",
    gradient:
      "radial-gradient(120% 120% at 80% 80%, rgba(251,146,60,0.4) 0%, rgba(251,146,60,0) 45%), linear-gradient(135deg, #2a1810 0%, #1a0f0a 60%, #100806 100%)",
  },
];
