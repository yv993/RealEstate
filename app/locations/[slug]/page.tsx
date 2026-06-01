import type { Metadata } from "next";
import Link from "next/link";
import { CSSProperties } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { PropertyCard } from "@/components/PropertyCard";
import { RevealStagger } from "@/components/motion/RevealStagger";
import { getProperties } from "@/lib/properties";
import { AREAS, getArea } from "@/lib/locations";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: "Area not found — EverGreen" };
  const title = `Property in ${area.name}, Armenia — EverGreen`;
  return {
    title,
    description: area.guide.slice(0, 155),
    alternates: { canonical: `${SITE_URL}/locations/${area.slug}` },
    openGraph: { title, description: area.short, url: `${SITE_URL}/locations/${area.slug}` },
  };
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const area = getArea(slug);

  if (!area) {
    return (
      <>
        <Nav />
        <div className="wrap" style={notFound}>
          <p className="eyebrow">404</p>
          <h1 className="h-section" style={{ fontSize: 30 }}>This area isn&apos;t covered yet</h1>
          <Link href="/locations" className="btn btn-primary btn-pill" style={{ marginTop: 8 }}>
            All neighbourhoods
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const properties = await getProperties();
  const inArea = properties.filter((p) => area.match(p.location));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${area.name}, Armenia`,
    description: area.guide,
    image: sceneUrl(area.scene),
    url: `${SITE_URL}/locations/${area.slug}`,
    address: { "@type": "PostalAddress", addressLocality: area.name, addressCountry: "AM" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <PageHero eyebrow="Neighbourhood guide" title={area.name} sub={area.short} img={sceneUrl(area.scene)} />
      <div className="section wrap">
        <nav aria-label="Breadcrumb" style={crumbs}>
          <Link href="/" style={{ color: "var(--fg2)" }}>Home</Link> <span>/</span>{" "}
          <Link href="/locations" style={{ color: "var(--fg2)" }}>Neighbourhoods</Link> <span>/</span>{" "}
          <span style={{ color: "var(--fg1)", fontWeight: 500 }}>{area.name}</span>
        </nav>
        <p className="lead" style={{ maxWidth: "68ch", fontSize: 17, marginBottom: 40 }}>
          {area.guide}
        </p>

        <h2 className="h-section" style={{ fontSize: 26, marginBottom: 24 }}>
          {inArea.length > 0 ? `Homes in ${area.name}` : `No listings in ${area.name} right now`}
        </h2>
        {inArea.length > 0 ? (
          <RevealStagger className="locarea-grid" style={areaGrid} stagger={0.1} y={28}>
            {inArea.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </RevealStagger>
        ) : (
          <p className="t-meta" style={{ marginBottom: 20 }}>
            New listings appear here as they come to market.{" "}
            <Link href="/properties">Browse all properties →</Link>
          </p>
        )}
      </div>
      <Footer />
    </>
  );
}

const notFound: CSSProperties = { minHeight: "60vh", paddingTop: "calc(var(--header-h) + 40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14 };
const crumbs: CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--fg2)", marginBottom: 22 };
const areaGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 };
