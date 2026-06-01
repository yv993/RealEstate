import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Called by the admin after creating/editing/deleting a listing, so the public
// (ISR-cached) pages refresh immediately instead of waiting for the 5-min window.
// Auth-gated: only a signed-in agency user can trigger it.
export async function POST() {
  console.log("[api/revalidate] POST start");
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("[api/revalidate] POST end — unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/rent");
  revalidatePath("/properties/[id]", "page");

  console.log("[api/revalidate] POST end — revalidated public property paths");
  return NextResponse.json({ ok: true });
}
