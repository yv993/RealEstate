import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, MapPin, ArrowUpRight } from "lucide-react";
import { type Property } from "@/lib/data";
import { BLUR_DATA_URL } from "@/lib/image";
import { Tilt } from "./motion/Tilt";
import { SpotlightCard } from "./motion/SpotlightCard";
import { FavoriteButton } from "./FavoriteButton";
import { CompareButton } from "./CompareButton";
import { Price } from "./Price";
import { InterestButton } from "./InterestButton";

// Shared component: server-rendered wherever possible. Hover is pure CSS; the only
// interactive bits are small client islands. Tilt/SpotlightCard are client wrappers.
export function PropertyCard({ p }: { p: Property }) {
  const badgeClass =
    p.badge === "Available" ? "badge badge-success" : p.badge === "New" ? "badge" : "badge badge-dark";
  const badgeStyle: CSSProperties =
    p.badge === "New"
      ? { background: "var(--surface)", color: "var(--fg1)", border: "1px solid var(--border)" }
      : {};

  // Freshness tag — deterministic "days on market" so it's stable across renders.
  const isNew = p.badge === "New";
  const daysOnMarket = ((p.id * 13) % 55) + 2;
  const freshness = isNew ? "New this week" : `${daysOnMarket} days on market`;

  return (
    <SpotlightCard>
      <Tilt max={5} scale={1.015}>
        <Link href={`/properties/${p.id}`} className="pcard" style={{ textDecoration: "none" }}>
          <article className="pcard-article" style={pcStyles.card}>
            <div style={pcStyles.media}>
              <Image
                src={p.img}
                alt={p.title}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="pcard-img"
                style={{ objectFit: "cover" }}
              />
              <span className={badgeClass} style={{ ...pcStyles.badge, ...badgeStyle }}>
                {p.badge}
              </span>
              <FavoriteButton id={p.id} />
              <CompareButton id={p.id} />
              <span className="pcard-cue" style={pcStyles.viewCue} aria-hidden>
                <ArrowUpRight size={16} />
              </span>
            </div>
            <div style={pcStyles.body}>
              <div style={pcStyles.topRow}>
                <div style={pcStyles.metaRow}>
                  <span style={pcStyles.meta}>
                    <BedDouble size={16} />
                    {p.beds} Bd
                  </span>
                  <span style={pcStyles.meta}>
                    <Bath size={16} />
                    {p.baths} Ba
                  </span>
                </div>
                <span style={{ ...pcStyles.fresh, ...(isNew ? pcStyles.freshNew : {}) }}>{freshness}</span>
              </div>
              <div style={pcStyles.title}>{p.title}</div>
              <div style={pcStyles.priceRow}>
                <span style={pcStyles.price}><Price p={p} /></span>
                <span style={pcStyles.loc}>
                  <MapPin size={13} />
                  {p.location}
                </span>
              </div>
              <InterestButton id={p.id} />
            </div>
          </article>
        </Link>
      </Tilt>
    </SpotlightCard>
  );
}

const pcStyles: Record<string, CSSProperties> = {
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-md)" },
  media: { position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--border)" },
  badge: { position: "absolute", top: 14, left: 14 },
  viewCue: { position: "absolute", right: 14, bottom: 14, width: 36, height: 36, borderRadius: 999, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", pointerEvents: "none" },
  body: { padding: 18 },
  topRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 },
  fresh: { fontSize: 11.5, fontWeight: 600, color: "var(--fg2)", whiteSpace: "nowrap" },
  freshNew: { color: "var(--accent-hover)" },
  metaRow: { display: "flex", gap: 18 },
  meta: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--fg2)" },
  title: { fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg1)" },
  priceRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" },
  price: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg1)" },
  loc: { display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--fg2)" },
};
