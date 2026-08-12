"use client";

import dynamic from "next/dynamic";

// The whole three.js chunk is client-only and lazy-loaded (ssr:false) so it
// never runs on the server and never blocks first paint.
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroCanvas() {
  return (
    // pointer-events enabled so the blob mesh can receive grab/drag events.
    // The hero copy sits in a higher z-index layer that is itself
    // pointer-events:none except on its buttons/links, so clicks meant for the
    // CTAs still win and empty areas fall through to the blob's raycast.
    <div className="pointer-events-auto absolute inset-0 -z-0" aria-hidden>
      <Scene />
    </div>
  );
}
