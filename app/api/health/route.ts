import { NextResponse } from "next/server";
import { isSupabaseConfigured, isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseReadClient } from "@/lib/supabase/server";
import { PROPERTIES } from "@/lib/data";

// Always evaluate at request time so it reflects the live env/DB, never a cache.
export const dynamic = "force-dynamic";

// Read-only diagnostic. Reports whether the deployment is talking to Supabase or
// using the built-in static fallback. Leaks nothing sensitive — only booleans and a count.
export async function GET() {
  console.log("[api/health] GET start");

  const supabaseConfigured = isSupabaseConfigured();
  const adminConfigured = isSupabaseAdminConfigured();

  let source: "database" | "static" = "static";
  let propertyCount = PROPERTIES.length;

  if (supabaseConfigured) {
    try {
      const sb = createSupabaseReadClient();
      const { count, error } = await sb
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("published", true);
      if (!error && count != null) {
        source = "database";
        propertyCount = count;
      }
    } catch {
      // fall through — stays on static
    }
  }

  console.log("[api/health] GET end —", { supabaseConfigured, adminConfigured, source, propertyCount });
  return NextResponse.json(
    {
      ok: true,
      supabaseConfigured,
      adminConfigured,
      source,
      propertyCount,
      // helpful, non-secret hints
      env: {
        NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
