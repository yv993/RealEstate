import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PropertyDetail } from "@/components/properties/PropertyDetail";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { getProperties, getPropertyById } from "@/lib/properties";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

// ISR: detail pages prerender at build (generateStaticParams) and refresh from the
// DB at most every 5 minutes.
export const revalidate = 300;

// Pre-render a page for each known property at build time.
export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = await getPropertyById(Number(id));
  if (!p) return { title: "Property not found — EverGreen" };
  const title = `${p.title} — ${p.location} | EverGreen`;
  const description = p.description.slice(0, 155);
  const url = `${SITE_URL}/properties/${p.id}`;
  const ogImage = (p.gallery && p.gallery[0]) || p.img;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "EverGreen",
      images: [{ url: ogImage, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: Params) {
  const { id } = await params;
  const p = await getPropertyById(Number(id));
  const all = p ? await getProperties() : [];

  const jsonLd = p && {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.description,
    url: `${SITE_URL}/properties/${p.id}`,
    image: p.gallery?.length ? p.gallery : [p.img],
    datePosted: undefined,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      ...(p.listingType === "rent" ? { businessFunction: "http://purl.org/goodrelations/v1#LeaseOut" } : {}),
    },
    address: { "@type": "PostalAddress", addressLocality: p.location, addressCountry: "AM" },
    accommodationCategory: p.type,
    numberOfRooms: p.beds,
    numberOfBedrooms: p.beds,
    numberOfBathroomsTotal: p.baths,
    yearBuilt: p.yearBuilt,
    floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" },
  };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <Nav active="Property List" />
      {p ? (
        <>
          <PropertyDetail p={p} all={all} />
          <RecentlyViewed properties={all} excludeId={p.id} />
        </>
      ) : (
        <div
          className="wrap"
          style={{
            minHeight: "60vh",
            paddingTop: "calc(var(--header-h) + 40px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 14,
          }}
        >
          <p className="eyebrow">404</p>
          <h1 className="h-section" style={{ fontSize: 30 }}>
            This property isn&apos;t available
          </h1>
          <p className="lead">It may have been sold or removed. Browse our current collection instead.</p>
          <Link href="/properties" className="btn btn-primary btn-pill" style={{ marginTop: 8 }}>
            View all properties
          </Link>
        </div>
      )}
      <Footer />
    </>
  );
}
