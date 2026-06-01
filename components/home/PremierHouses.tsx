import { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROPERTIES } from "@/lib/data";
import { PropertyCard } from "../PropertyCard";
import { Reveal } from "../motion/Reveal";
import { RevealStagger } from "../motion/RevealStagger";

export function PremierHouses() {
  const list = PROPERTIES.slice(0, 6);
  return (
    <section className="section wrap">
      <div style={prStyles.head}>
        <div>
          <Reveal as="p" className="eyebrow">
            Our portfolio
          </Reveal>
          <Reveal as="h2" className="h-section" style={{ fontSize: 34 }} delay={0.05}>
            Explore our premier houses
          </Reveal>
          <Reveal as="p" className="lead" style={{ marginTop: 12 }} delay={0.1}>
            Each listing offers unique features, exceptional quality, and prime locations — ensuring
            an exclusive living experience.
          </Reveal>
        </div>
        <Reveal delay={0.1} style={{ flexShrink: 0 }}>
          <Link href="/properties" className="btn btn-primary btn-pill">
            See All Properties
            <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </div>
      <RevealStagger className="premier-grid" style={prStyles.grid} stagger={0.1} y={34}>
        {list.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </RevealStagger>
    </section>
  );
}

const prStyles: Record<string, CSSProperties> = {
  head: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 36, flexWrap: "wrap" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
};
