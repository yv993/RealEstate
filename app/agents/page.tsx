import { CSSProperties } from "react";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { RevealStagger } from "@/components/motion/RevealStagger";
import { AGENTS } from "@/lib/agents";
import { sceneUrl } from "@/lib/scenes";
import { BLUR_DATA_URL } from "@/lib/image";

export const metadata = {
  title: "Our Team — EverGreen",
  description: "Meet the EverGreen advisors — a small Yerevan-based team fluent in Armenian, Russian, and English.",
};

export default function AgentsPage() {
  return (
    <>
      <Nav />
      <PageHero
        eyebrow="The people"
        title="Our Team"
        sub="A small, dedicated team in Yerevan — fluent in Armenian, Russian, and English."
        img={sceneUrl("city")}
      />
      <div className="section wrap">
        <RevealStagger className="agents-grid" style={grid} stagger={0.08} y={28}>
          {AGENTS.map((a) => (
            <div key={a.slug} className="agent-card" style={card}>
              <div style={imgWrap}>
                <Image src={a.img} alt={a.name} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="agent-img" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "18px 20px 20px" }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{a.name}</div>
                <div className="t-meta" style={{ marginBottom: 12 }}>{a.role}</div>
                <div style={langRow}>
                  {a.languages.map((l) => (
                    <span key={l} style={lang}>{l}</span>
                  ))}
                </div>
                <div style={contactRow}>
                  <a href={`tel:${a.phone.replace(/\s/g, "")}`} style={contactLink} aria-label={`Call ${a.name}`}>
                    <Phone size={15} />
                    {a.phone}
                  </a>
                  <a href={`mailto:${a.email}`} style={contactLink} aria-label={`Email ${a.name}`}>
                    <Mail size={15} />
                    {a.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </RevealStagger>
      </div>
      <Footer />
    </>
  );
}

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 };
const card: CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-sm)" };
const imgWrap: CSSProperties = { position: "relative", aspectRatio: "4 / 3", background: "var(--border)" };
const langRow: CSSProperties = { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 };
const lang: CSSProperties = { fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent-hover)" };
const contactRow: CSSProperties = { display: "flex", flexDirection: "column", gap: 8, paddingTop: 14, borderTop: "1px solid var(--border)" };
const contactLink: CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--fg2)" };
