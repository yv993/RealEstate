"use client";

import Link from "next/link";
import Image from "next/image";
import { CSSProperties } from "react";
import { X, Scale } from "lucide-react";
import { useCompare } from "@/lib/compare";
import { type Property } from "@/lib/data";
import { BLUR_DATA_URL } from "@/lib/image";
import { Price } from "./Price";

const ROWS: { label: string; val: (p: Property) => React.ReactNode }[] = [
  { label: "Price", val: (p) => <Price p={p} /> },
  { label: "Location", val: (p) => p.location },
  { label: "Type", val: (p) => p.type },
  { label: "Bedrooms", val: (p) => p.beds },
  { label: "Bathrooms", val: (p) => p.baths },
  { label: "Area", val: (p) => `${p.area} m²` },
  { label: "Garage", val: (p) => p.garage },
  { label: "Year built", val: (p) => p.yearBuilt },
  { label: "Listing", val: (p) => (p.listingType === "rent" ? "For rent" : "For sale") },
];

export function CompareTable({ properties }: { properties: Property[] }) {
  const { ids, remove, ready, clear } = useCompare();

  if (!ready) {
    return <div className="skeleton" style={{ height: 360, borderRadius: 16, maxWidth: "var(--content-max)", margin: "0 auto" }} />;
  }

  const items = ids.map((id) => properties.find((p) => p.id === id)).filter(Boolean) as Property[];

  if (items.length === 0) {
    return (
      <div style={s.empty}>
        <span style={s.emptyIcon}>
          <Scale size={26} />
        </span>
        <h2 className="h-section" style={{ fontSize: 24, margin: "16px 0 8px" }}>
          Nothing to compare yet
        </h2>
        <p className="lead" style={{ margin: "0 auto 20px" }}>
          Add up to three properties using the compare icon on any card, then see their specs side by side.
        </p>
        <Link href="/properties" className="btn btn-primary btn-pill">
          Browse properties
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn btn-ghost" onClick={clear}>
          Clear all
        </button>
      </div>
      <div style={s.scroll}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, ...s.labelCol }} />
              {items.map((p) => (
                <th key={p.id} style={s.th}>
                  <div style={s.card}>
                    <button onClick={() => remove(p.id)} aria-label={`Remove ${p.title}`} style={s.remove}>
                      <X size={14} />
                    </button>
                    <Link href={`/properties/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={s.imgWrap}>
                        <Image src={p.img} alt={p.title} fill sizes="240px" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={{ objectFit: "cover" }} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginTop: 10 }}>{p.title}</div>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <td style={{ ...s.td, ...s.labelCol, fontWeight: 600, color: "var(--fg2)" }}>{row.label}</td>
                {items.map((p) => (
                  <td key={p.id} style={s.td}>
                    {row.val(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  empty: { textAlign: "center", padding: "70px 0", maxWidth: 460, margin: "0 auto" },
  emptyIcon: { width: 64, height: 64, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "inline-grid", placeItems: "center" },
  scroll: { overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", background: "var(--surface)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 },
  th: { padding: 18, textAlign: "left", verticalAlign: "bottom", borderBottom: "1px solid var(--border)" },
  td: { padding: "14px 18px", borderBottom: "1px solid var(--border)" },
  labelCol: { width: 150, background: "var(--bg)", position: "sticky", left: 0 },
  card: { position: "relative", width: 200 },
  imgWrap: { position: "relative", width: "100%", height: 130, borderRadius: 12, overflow: "hidden", background: "var(--border)" },
  remove: { position: "absolute", top: 6, right: 6, zIndex: 2, width: 28, height: 28, borderRadius: 999, border: 0, background: "rgba(255,255,255,0.9)", color: "#1A1A1A", display: "grid", placeItems: "center", cursor: "pointer" },
};
