import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "./config";

// Auth-aware server client (reads/writes the session cookie). Use in server
// components, route handlers, and server actions for anything tied to the logged-in
// user. RLS still applies.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a server component where cookies are read-only — safe to ignore.
        }
      },
    },
  });
}

// Privileged server client using the service role key — bypasses RLS. NEVER import
// this into client code. Use only in trusted server code (e.g. inserting leads).
export function createSupabaseAdminClient() {
  return createServerClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

// Anonymous read client with NO cookie access — public, published-only reads.
// Because it never touches next/headers cookies(), pages using it can be
// statically rendered with ISR instead of being forced dynamic.
export function createSupabaseReadClient() {
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
