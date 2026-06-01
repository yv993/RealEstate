"use client";

import { CSSProperties } from "react";
import { useRecent } from "@/lib/recent";
import { PropertyCard } from "./PropertyCard";
import type { Property } from "@/lib/data";

export function RecentlyViewed({
  properties,
  excludeId,
  title = "Recently viewed",
}: {
  properties: Property[];
  excludeId?: number;
  title?: string;
}) {
  const { ids, ready } = useRecent();
  if (!ready) return null;

  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4) as Property[];

  if (items.length === 0) return null;

  return (
    <section className="section wrap">
      <h2 className="h-section" style={{ fontSize: 24, marginBottom: 24 }}>
        {title}
      </h2>
      <div className="recent-grid" style={grid}>
        {items.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

const grid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 };
