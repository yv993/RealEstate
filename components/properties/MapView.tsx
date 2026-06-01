"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/lib/data";

// Leaflet needs the browser, so load the map client-only with a skeleton.
const PropertyMap = dynamic(() => import("./PropertyMap").then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: "100%", borderRadius: "var(--radius-card)" }} />,
});

export function MapView({
  properties,
  height = 560,
  single,
  zoom,
}: {
  properties: Property[];
  height?: number | string;
  single?: boolean;
  zoom?: number;
}) {
  return (
    <div style={{ height }}>
      <PropertyMap properties={properties} height="100%" single={single} zoom={zoom} />
    </div>
  );
}
