import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for a small production Docker image.
  // Harmless on Vercel (it manages output itself).
  output: "standalone",
};

export default nextConfig;
