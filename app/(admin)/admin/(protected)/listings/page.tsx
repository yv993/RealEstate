import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ListingsManager } from "@/components/admin/ListingsManager";

export default function AdminListingsPage() {
  // Guard so the browser-client component never mounts without Supabase keys.
  if (!isSupabaseConfigured()) return null;
  return <ListingsManager />;
}
