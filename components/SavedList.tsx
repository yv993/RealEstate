"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Property } from "@/lib/data";
import { useFavorites } from "@/lib/favorites";
import { PropertyCard } from "./PropertyCard";

export function SavedList({ properties }: { properties: Property[] }) {
  const { ids, ready } = useFavorites();

  if (!ready) {
    return (
      <div className="cat-grid" style={styles.grid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 320, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  const saved = properties.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>
          <Heart size={26} />
        </span>
        <h2 className="h-section" style={{ fontSize: 24, margin: "16px 0 8px" }}>
          No saved properties yet
        </h2>
        <p className="lead" style={{ margin: "0 auto 20px" }}>
          Tap the heart on any property to save it here for later — across the whole site.
        </p>
        <Link href="/properties" className="btn btn-primary btn-pill">
          Browse properties
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="t-meta" style={{ maxWidth: "var(--content-max)", margin: "0 auto 24px" }}>
        {saved.length} saved {saved.length === 1 ? "property" : "properties"}
      </p>
      <div className="cat-grid" style={styles.grid}>
        {saved.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  grid: { maxWidth: "var(--content-max)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  empty: { textAlign: "center", padding: "70px 0", maxWidth: 440, margin: "0 auto" },
  emptyIcon: { width: 64, height: 64, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "inline-grid", placeItems: "center" },
};
