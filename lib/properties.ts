// Data access for properties. Tries Supabase first; falls back to the static list in
// lib/data.ts whenever Supabase isn't configured or a query fails. This is what lets
// the site work today and "switch on" the database the moment you add your keys.

import { PROPERTIES, IMG, type Property } from "./data";
import { isSupabaseConfigured } from "./supabase/config";
import { createSupabaseReadClient } from "./supabase/server";

// Shape rows coming back from Postgres into our Property type.
// Tolerates gallery/features stored as jsonb arrays or plain text.
function mapRow(r: Record<string, unknown>): Property {
  const asArray = (v: unknown): string[] =>
    Array.isArray(v) ? (v as string[]) : typeof v === "string" && v ? JSON.parse(v) : [];
  return {
    id: Number(r.id),
    price: Number(r.price),
    title: String(r.title ?? ""),
    location: String(r.location ?? ""),
    type: String(r.type ?? ""),
    beds: Number(r.beds ?? 0),
    baths: Number(r.baths ?? 0),
    area: Number(r.area ?? 0),
    badge: String(r.badge ?? "For Sale"),
    img: String(r.img ?? IMG("1568605114967-8130f3a36994")),
    description: String(r.description ?? ""),
    yearBuilt: Number(r.year_built ?? r.yearBuilt ?? 0),
    garage: Number(r.garage ?? 0),
    gallery: asArray(r.gallery),
    features: asArray(r.features),
    listingType: (r.listing_type ?? r.listingType ?? "sale") === "rent" ? "rent" : "sale",
    rentPeriod: (r.rent_period ?? r.rentPeriod) === "month" ? "month" : undefined,
    lat: Number(r.lat ?? 0),
    lng: Number(r.lng ?? 0),
  };
}

export async function getProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return PROPERTIES;
  try {
    const sb = createSupabaseReadClient();
    const { data, error } = await sb
      .from("properties")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return PROPERTIES;
    return data.map(mapRow);
  } catch {
    return PROPERTIES;
  }
}

export async function getPropertyById(id: number): Promise<Property | null> {
  const fallback = PROPERTIES.find((p) => p.id === id) ?? null;
  if (!isSupabaseConfigured()) return fallback;
  try {
    const sb = createSupabaseReadClient();
    const { data, error } = await sb.from("properties").select("*").eq("id", id).single();
    if (error || !data) return fallback;
    return mapRow(data as Record<string, unknown>);
  } catch {
    return fallback;
  }
}
