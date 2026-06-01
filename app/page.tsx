import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { ValueSection } from "@/components/home/ValueSection";
import { StatsBand } from "@/components/home/StatsBand";
import { MapBand } from "@/components/home/MapBand";
import { PremierHouses } from "@/components/home/PremierHouses";
import { Faq } from "@/components/home/Faq";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBanner } from "@/components/home/CtaBanner";
import { TrustBand } from "@/components/home/TrustBand";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata = {
  title: "EverGreen — Build Your Future, One Property at a Time",
  description:
    "A boutique real-estate agency. Curated homes and investments in the places worth living — thoughtful design, exceptional quality, prime locations.",
};

export default function HomePage() {
  return (
    <>
      <Nav active="Home" />
      <Hero />
      <TrustBand />
      <ValueSection />
      <StatsBand />
      <MapBand />
      <PremierHouses />
      <Faq />
      <Testimonials />
      <Newsletter />
      <CtaBanner />
      <Footer />
    </>
  );
}
