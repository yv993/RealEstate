import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

// Thin POST handler: validate the lead, then insert it server-side. Uses the
// service-role client so leads can be written even though RLS blocks public writes.
// If Supabase isn't configured yet, it logs the lead and returns success so the
// UI still works during development.
export async function POST(request: Request) {
  console.log("[api/leads] POST start");
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const message = String(body.message ?? "").trim();
    const property_id = body.property_id != null ? Number(body.property_id) : null;

    // Validation (the error path).
    if (!name) {
      console.log("[api/leads] POST end — validation failed (name)");
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      console.log("[api/leads] POST end — validation failed (email)");
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured()) {
      // No backend yet — accept gracefully so the front end keeps working.
      console.log("[api/leads] POST end — Supabase not configured, lead logged only:", { name, email });
      return NextResponse.json({ ok: true, stored: false });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("leads")
      .insert({ name, email, phone, message, property_id });

    if (error) {
      console.log("[api/leads] POST end — insert error:", error.message);
      return NextResponse.json({ error: "Could not save your message" }, { status: 500 });
    }

    console.log("[api/leads] POST end — lead saved");
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.log("[api/leads] POST end — unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
