import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { notifyLead } from "@/lib/email";

// Thin handler: rate-limit → validate → save → email. Each external piece degrades
// gracefully (no Supabase / no Resend still returns success and logs).
export async function POST(request: Request) {
  console.log("[api/leads] POST start");
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`leads:${ip}`, 5, 60_000);
    if (!rl.ok) {
      console.log("[api/leads] POST end — rate limited", ip);
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid input";
      console.log("[api/leads] POST end — validation failed:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    if (parsed.data.company) {
      console.log("[api/leads] POST end — honeypot tripped");
      return NextResponse.json({ ok: true });
    }

    const { name, email, phone, message, property_id } = parsed.data;
    const lead = { name, email, phone: phone || null, message: message ?? "", property_id: property_id ?? null };

    if (isSupabaseAdminConfigured()) {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("leads").insert(lead);
      if (error) {
        console.log("[api/leads] POST end — insert error:", error.message);
        return NextResponse.json({ error: "Could not save your message" }, { status: 500 });
      }
    } else {
      console.log("[api/leads] Supabase not configured — lead logged only:", email);
    }

    await notifyLead(lead);

    console.log("[api/leads] POST end — saved & notified");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.log("[api/leads] POST end — unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
