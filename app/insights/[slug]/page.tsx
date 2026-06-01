import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CSSProperties } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ARTICLES, getArticle, readingMinutes } from "@/lib/insights";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { BLUR_DATA_URL } from "@/lib/image";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Article not found — EverGreen" };
  const url = `${SITE_URL}/insights/${a.slug}`;
  return {
    title: `${a.title} — EverGreen`,
    description: a.excerpt,
    alternates: { canonical: url },
    openGraph: { type: "article", title: a.title, description: a.excerpt, url, images: [{ url: sceneUrl(a.scene) }] },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const a = getArticle(slug);

  if (!a) {
    return (
      <>
        <Nav />
        <div className="wrap" style={notFound}>
          <p className="eyebrow">404</p>
          <h1 className="h-section" style={{ fontSize: 30 }}>Article not found</h1>
          <Link href="/insights" className="btn btn-primary btn-pill" style={{ marginTop: 8 }}>All insights</Link>
        </div>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: sceneUrl(a.scene),
    datePublished: a.date,
    dateModified: a.date,
    author: { "@type": "Person", name: a.author },
    publisher: { "@type": "Organization", name: "EverGreen" },
    mainEntityOfPage: `${SITE_URL}/insights/${a.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <article style={{ paddingTop: "calc(var(--header-h) + 32px)", paddingBottom: 80 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <nav aria-label="Breadcrumb" style={crumbs}>
            <Link href="/" style={{ color: "var(--fg2)" }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/insights" style={{ color: "var(--fg2)" }}>Insights</Link>
          </nav>
          <h1 className="h-hero" style={{ fontSize: "clamp(30px, 4vw, 44px)", marginBottom: 16 }}>{a.title}</h1>
          <div style={byline}>
            <span>By {a.author}</span>
            <span style={dot} />
            <span>{fmtDate(a.date)}</span>
            <span style={dot} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Clock size={14} />
              {readingMinutes(a)} min read
            </span>
          </div>
          <div style={heroImg}>
            <Image src={sceneUrl(a.scene, 1400)} alt={SCENES[a.scene].alt} fill priority sizes="(max-width: 800px) 100vw, 760px" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={{ objectFit: "cover" }} />
          </div>

          {a.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="h-section" style={{ fontSize: 24, margin: "34px 0 12px" }}>{s.heading}</h2>}
              <p style={para}>{s.body}</p>
            </section>
          ))}

          <div style={{ marginTop: 44, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <Link href="/insights" className="btn btn-outline btn-pill">← All insights</Link>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}

const notFound: CSSProperties = { minHeight: "60vh", paddingTop: "calc(var(--header-h) + 40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14 };
const crumbs: CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--fg2)", marginBottom: 18 };
const byline: CSSProperties = { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--fg2)", marginBottom: 28, flexWrap: "wrap" };
const dot: CSSProperties = { width: 3, height: 3, borderRadius: 999, background: "var(--fg2)" };
const heroImg: CSSProperties = { position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--border)", boxShadow: "var(--shadow-md)" };
const para: CSSProperties = { fontSize: 17, lineHeight: 1.75, color: "var(--fg1)", marginTop: 14 };
