import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getProperties } from "@/lib/properties";
import { AREAS } from "@/lib/locations";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { BLUR_DATA_URL } from "@/lib/image";

export const metadata = {
  title: "Neighbourhoods & Regions in Armenia — EverGreen",
  description: "Explore the areas we cover across Armenia — from central Yerevan to Dilijan, Sevan, Gyumri, and Jermuk.",
};

export const revalidate = 300;

export default async function LocationsPage() {
  const properties = await getProperties();
  const areas = AREAS.map((a) => ({ ...a, count: properties.filter((p) => a.match(p.location)).length }));

  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Where we work"
        title="Neighbourhoods & Regions"
        sub="Get to know the places we cover — and find the corner of Armenia that fits you."
        img={sceneUrl("valley")}
      />
      <div className="section wrap">
        <div className="locations-grid" style={grid}>
          {areas.map((a) => (
            <Reveal key={a.slug}>
              <Link href={`/locations/${a.slug}`} className="loc-card" style={card}>
                <div style={imgWrap}>
                  <Image src={sceneUrl(a.scene, 900)} alt={SCENES[a.scene].alt} fill sizes="(max-width: 1023px) 100vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="loc-img" style={{ objectFit: "cover" }} />
                  <div style={scrim} />
                  <div style={content}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.9 }}>{a.count} {a.count === 1 ? "property" : "properties"}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 14, opacity: 0.92 }}>{a.short}</div>
                  </div>
                  <span style={arrow}>
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 };
const card: CSSProperties = { display: "block", textDecoration: "none", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-md)" };
const imgWrap: CSSProperties = { position: "relative", aspectRatio: "4 / 5", background: "var(--border)" };
const scrim: CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,18,14,0.05) 30%, rgba(15,18,14,0.78) 100%)" };
const content: CSSProperties = { position: "absolute", left: 20, right: 20, bottom: 18, color: "#fff", display: "flex", flexDirection: "column", gap: 4, zIndex: 2 };
const arrow: CSSProperties = { position: "absolute", top: 16, right: 16, zIndex: 2, width: 38, height: 38, borderRadius: 999, background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", display: "grid", placeItems: "center", backdropFilter: "blur(6px)" };
