import { CSSProperties } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: "calc(var(--header-h) + 40px)", paddingBottom: 80 }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <p className="eyebrow">Legal</p>
          <h1 className="h-hero" style={{ fontSize: "clamp(32px, 4.5vw, 48px)", marginBottom: 10 }}>{title}</h1>
          <p className="t-meta" style={{ marginBottom: 28 }}>Last updated {updated}</p>
          <p className="lead" style={{ fontSize: 17, maxWidth: "68ch", marginBottom: 36 }}>{intro}</p>

          {sections.map((s, i) => (
            <section key={i} style={{ marginBottom: 28 }}>
              <h2 className="h-section" style={{ fontSize: 22, marginBottom: 12 }}>
                {i + 1}. {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} style={para}>{p}</p>
              ))}
            </section>
          ))}

          <p className="t-meta" style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            Questions? Contact us at <a href="mailto:hello@evergreen.am">hello@evergreen.am</a> or (+374) 10 539 853.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

const para: CSSProperties = { fontSize: 16, lineHeight: 1.7, color: "var(--fg2)", marginTop: 12 };
