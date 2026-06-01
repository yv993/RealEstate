// Central place to read Supabase env vars and check whether the backend is wired up.
// The site is built to run with OR without Supabase — when these are missing we fall
// back to the static data in lib/data.ts, so nothing breaks before you connect a DB.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the public URL + anon key are present (enough for reads + auth). */
export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** True when the server-only service role key is also present (for privileged writes). */
export const isSupabaseAdminConfigured = () =>
  Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
