import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SavedList } from "@/components/SavedList";
import { getProperties } from "@/lib/properties";

export const metadata = {
  title: "Saved Properties — EverGreen",
  description: "The homes you've saved across EverGreen.",
  robots: { index: false },
};

export default async function SavedPage() {
  const properties = await getProperties();
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Your shortlist"
        title="Saved Properties"
        sub="Everything you've hearted, gathered in one calm place."
        img="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1900&q=80"
      />
      <div className="catalog-section">
        <SavedList properties={properties} />
      </div>
      <Footer />
    </>
  );
}
