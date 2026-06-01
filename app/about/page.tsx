import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { AboutStory, Values, AboutStats, Team } from "@/components/about/AboutSections";

export const metadata = {
  title: "About Us — EverGreen",
  description:
    "A boutique real-estate agency built on trust, not noise. Meet the small team behind EverGreen's curated approach to buying a home.",
};

export default function AboutPage() {
  return (
    <>
      <Nav active="About Us" />
      <PageHero
        eyebrow="About EverGreen"
        title="Curated living, calmly delivered"
        sub="A boutique real-estate agency for people who value quality over quantity."
        img="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1900&q=80"
      />
      <AboutStory />
      <Values />
      <AboutStats />
      <Team />
      <Footer />
    </>
  );
}
