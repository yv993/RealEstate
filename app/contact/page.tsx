import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContactBody } from "@/components/contact/ContactBody";

export const metadata = {
  title: "Contact Us — EverGreen",
  description:
    "Get a consultation. Reach out and we'll guide you, calmly, toward your next home — no pressure, no clutter.",
};

export default function ContactPage() {
  return (
    <>
      <Nav active="Contact Us" />
      <PageHero
        eyebrow="Contact"
        title="Get a Consultation"
        sub="Reach out and we'll guide you, calmly, toward your next home."
        img="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1900&q=80"
      />
      <ContactBody />
      <Footer />
    </>
  );
}
