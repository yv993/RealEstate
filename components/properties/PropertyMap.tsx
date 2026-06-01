"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type Property } from "@/lib/data";
import { useCurrency } from "@/lib/currency";

// Bronze/green brand pin as an inline SVG divIcon (avoids Leaflet's image-asset issues).
function pin(active: boolean) {
  const color = active ? "#94733F" : "#B08D57";
  return L.divIcon({
    className: "evg-pin",
    html: `<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.6 0 14.8 0 25 15 38 15 38s15-13 15-23.2C30 6.6 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="5.5" fill="#fff"/></svg>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

type Props = {
  properties: Property[];
  height?: number | string;
  /** force a single-property centred view */
  single?: boolean;
  zoom?: number;
};

export function PropertyMap({ properties, height = 560, single = false, zoom }: Props) {
  const dark = useIsDark();
  const { format } = useCurrency();

  const center = useMemo<[number, number]>(() => {
    if (properties.length === 0) return [40.1792, 44.5152]; // Yerevan
    if (single || properties.length === 1) return [properties[0].lat, properties[0].lng];
    const avgLat = properties.reduce((s, p) => s + p.lat, 0) / properties.length;
    const avgLng = properties.reduce((s, p) => s + p.lng, 0) / properties.length;
    return [avgLat, avgLng];
  }, [properties, single]);

  const tileUrl = dark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div style={{ height, width: "100%", borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--border)" }}>
      <MapContainer
        center={center}
        zoom={zoom ?? (single ? 13 : 7)}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "var(--band)" }}
      >
        <TileLayer
          key={dark ? "dark" : "light"}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {properties.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pin(false)}>
            <Popup>
              <Link href={`/properties/${p.id}`} style={{ textDecoration: "none", color: "inherit", display: "block", width: 180 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} style={{ width: "100%", height: 96, objectFit: "cover", borderRadius: 8, display: "block", marginBottom: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{p.title}</div>
                <div style={{ fontSize: 12.5, color: "#6B6B6B" }}>{p.location}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#94733F", marginTop: 4 }}>
                  {format(p.price)}
                  {p.listingType === "rent" ? ` / ${p.rentPeriod ?? "month"}` : ""}
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
