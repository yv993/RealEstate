import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { subscribeSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { notifySubscriber } from "@/lib/email";

export async function POST(request: Request) {
  console.log("[api/subscribe] POST start");
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`subscribe:${ip}`, 5, 60_000);
    if (!rl.ok) {
      console.log("[api/subscribe] POST end — rate limited", ip);
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Please enter a valid email";
      console.log("[api/subscribe] POST end — validation failed:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    if (parsed.data.company) {
      console.log("[api/subscribe] POST end — honeypot tripped");
      return NextResponse.json({ ok: true });
    }

    const { email } = parsed.data;

    if (isSupabaseAdminConfigured()) {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase.from("subscribers").upsert({ email }, { onConflict: "email" });
      if (error) {
        console.log("[api/subscribe] POST end — insert error:", error.message);
        return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
      }
    } else {
      console.log("[api/subscribe] Supabase not configured — subscriber logged only:", email);
    }

    await notifySubscriber(email);

    console.log("[api/subscribe] POST end — subscribed & notified");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.log("[api/subscribe] POST end — unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
