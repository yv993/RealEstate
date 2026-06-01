import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Catalog } from "@/components/properties/Catalog";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { getProperties } from "@/lib/properties";

export const metadata = {
  title: "Homes for Rent in Armenia — EverGreen",
  description: "Furnished apartments and houses for rent across Yerevan, Dilijan, Sevan and beyond.",
};

export const revalidate = 300;

export default async function RentPage() {
  const properties = await getProperties();
  return (
    <>
      <Nav active="For Rent" />
      <PageHero
        eyebrow="For rent"
        title="Homes for Rent"
        sub="Furnished apartments and houses across Armenia — move in and feel at home."
        img="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1900&q=80"
      />
      <div className="catalog-section">
        <Catalog properties={properties} initialListingType="rent" />
      </div>
      <RecentlyViewed properties={properties} />
      <Footer />
    </>
  );
}
