import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CompareTable } from "@/components/CompareTable";
import { getProperties } from "@/lib/properties";

export const metadata = {
  title: "Compare Properties — EverGreen",
  description: "Compare your shortlisted homes side by side.",
  robots: { index: false },
};

export const revalidate = 300;

export default async function ComparePage() {
  const properties = await getProperties();
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Side by side"
        title="Compare Properties"
        sub="Weigh your options at a glance — specs, price, and location together."
        img="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1900&q=80"
      />
      <div className="catalog-section">
        <CompareTable properties={properties} />
      </div>
      <Footer />
    </>
  );
}
