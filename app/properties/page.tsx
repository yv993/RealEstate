import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Catalog } from "@/components/properties/Catalog";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { getProperties } from "@/lib/properties";

export const metadata = {
  title: "Property List — EverGreen",
  description: "Curated homes and investments — chosen with care, presented with calm.",
};

// ISR: re-build this page at most every 5 minutes from fresh DB data.
export const revalidate = 300;

export default async function PropertiesPage() {
  const properties = await getProperties();
  return (
    <>
      <Nav active="Property List" />
      <PageHero
        eyebrow="Our portfolio"
        title="Property List"
        sub="Curated homes and investments — chosen with care, presented with calm."
        img="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1900&q=80"
      />
      <div className="catalog-section">
        <Catalog properties={properties} />
      </div>
      <RecentlyViewed properties={properties} />
      <Footer />
    </>
  );
}
