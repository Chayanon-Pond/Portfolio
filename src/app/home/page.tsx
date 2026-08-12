import Nav from "@/components/Nav";
import HomeHero from "@/components/HomeHero";
import Expertise from "@/components/Expertise";
import Timeline from "@/components/Timeline";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * `/home` — the main portfolio. The fixed sticky nav sits on top; sections start
 * cleanly beneath it (each has its own top padding + `scroll-mt`). Order:
 * Hero (rotating "Chayanon Pond ⇄ a Developer") → My Expertise → Education &
 * Experience timeline → See My Works → Contact. Nav "Home" routes to the `/`
 * intro; "Stack" routes to the intro's stack section; the rest are in-page.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <HomeHero />
        <Expertise />
        <Timeline />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
