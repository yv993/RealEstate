import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNotice } from "@/components/admin/AdminNotice";

export const metadata = { title: "EverGreen Admin", robots: { index: false } };

// Admin always renders fresh (live leads + listings), never statically cached.
export const dynamic = "force-dynamic";

// Guards every page under /admin (except /admin/login): redirects to login when
// there's no signed-in user. Shows a friendly notice if Supabase isn't set up.
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <AdminNotice />;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return <AdminShell email={user.email ?? "admin"}>{children}</AdminShell>;
}
