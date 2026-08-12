import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone server output is ONLY for Docker builds (set BUILD_STANDALONE=true).
  // It must stay OFF on Vercel — `output: standalone` breaks Vercel's build
  // (next-server.js.nft.json ENOENT).
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;
