import Hero from "@/components/Hero";
import Build from "@/components/Build";
import StackIntro from "@/components/StackIntro";
import Focus from "@/components/Focus";
import AiStack from "@/components/AiStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * `/` — the cinematic intro, now a full long-scroll story with NO top nav bar:
 * Hero → What I build → Stack → Focus → Contact. Each section slides in from the
 * left/right (SplitReveal), converging to center — fail-safe and reduced-motion
 * aware. The "VIEW PORTFOLIO" CTA wipes to `/home`. Persistent chrome (loader,
 * cursor, smooth scroll, page transition, scroll-progress ring) lives in the
 * shared SiteShell.
 */
export default function IntroPage() {
  return (
    <>
      <main id="main">
        <Hero />
        <Build />
        <StackIntro />
        <Focus />
        <AiStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
