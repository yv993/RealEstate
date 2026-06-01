import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ARTICLES, readingMinutes } from "@/lib/insights";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { BLUR_DATA_URL } from "@/lib/image";

export const metadata = {
  title: "Insights — The Armenian Property Market — EverGreen",
  description: "Guides and perspective on buying, renting, and investing in property across Armenia.",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function InsightsPage() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="Insights"
        title="The Armenian Property Market"
        sub="Practical guides and perspective on buying, renting, and investing across Armenia."
        img={sceneUrl("mountains")}
      />
      <div className="section wrap">
        <div className="insights-grid" style={grid}>
          {ARTICLES.map((a) => (
            <Reveal key={a.slug}>
              <Link href={`/insights/${a.slug}`} className="loc-card" style={card}>
                <div style={imgWrap}>
                  <Image src={sceneUrl(a.scene, 800)} alt={SCENES[a.scene].alt} fill sizes="(max-width: 1023px) 100vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="loc-img" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px 22px 22px" }}>
                  <div style={meta}>
                    <span>{fmtDate(a.date)}</span>
                    <span style={dot} />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <Clock size={13} />
                      {readingMinutes(a)} min read
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, lineHeight: 1.25, margin: "8px 0 8px" }}>{a.title}</h2>
                  <p className="t-meta" style={{ lineHeight: 1.6 }}>{a.excerpt}</p>
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
const card: CSSProperties = { display: "block", textDecoration: "none", color: "var(--fg1)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-sm)" };
const imgWrap: CSSProperties = { position: "relative", aspectRatio: "16 / 10", background: "var(--border)" };
const meta: CSSProperties = { display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "var(--fg2)" };
const dot: CSSProperties = { width: 3, height: 3, borderRadius: 999, background: "var(--fg2)" };
