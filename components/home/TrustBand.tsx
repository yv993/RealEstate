import { CSSProperties } from "react";
import Image from "next/image";

// Monochrome partner / press logos (placeholders — swap for real partners).
const LOGOS = ["theguardian", "zillow", "tripadvisor", "trustpilot", "airbnb"];

export function TrustBand() {
  return (
    <section style={band}>
      <div className="wrap" style={inner}>
        <span className="t-label" style={{ color: "var(--fg2)", whiteSpace: "nowrap" }}>
          As featured in &amp; trusted by
        </span>
        <div style={logos}>
          {LOGOS.map((s) => (
            <Image
              key={s}
              src={`https://cdn.simpleicons.org/${s}/9A9A98`}
              width={104}
              height={26}
              alt={s}
              unoptimized
              style={{ height: 22, width: "auto", opacity: 0.75 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const band: CSSProperties = { background: "var(--bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "22px 0" };
const inner: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 36, flexWrap: "wrap" };
const logos: CSSProperties = { display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap", justifyContent: "center" };
