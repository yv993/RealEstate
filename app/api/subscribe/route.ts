import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

// Newsletter signup. Validates the email, drops obvious bots via a honeypot, and
// inserts into the "subscribers" table server-side. Works without Supabase too.
export async function POST(request: Request) {
  console.log("[api/subscribe] POST start");
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email ?? "").trim();
    const honeypot = String(body.company ?? "").trim();

    // Honeypot: real users leave this empty. Pretend success for bots.
    if (honeypot) {
      console.log("[api/subscribe] POST end — honeypot tripped");
      return NextResponse.json({ ok: true });
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      console.log("[api/subscribe] POST end — invalid email");
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured()) {
      console.log("[api/subscribe] POST end — Supabase not configured, logged only:", email);
      return NextResponse.json({ ok: true, stored: false });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("subscribers").upsert({ email }, { onConflict: "email" });
    if (error) {
      console.log("[api/subscribe] POST end — insert error:", error.message);
      return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
    }

    console.log("[api/subscribe] POST end — subscribed");
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    console.log("[api/subscribe] POST end — unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
