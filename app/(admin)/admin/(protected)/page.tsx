import { CSSProperties } from "react";
import { Inbox } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_id: number | null;
  created_at: string;
};

export default async function LeadsDashboard() {
  // The layout already shows a notice when Supabase isn't configured; guard here
  // too because React Server Components still execute this page either way.
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads: Lead[] = (data as Lead[]) ?? [];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="h-section" style={{ fontSize: 26 }}>
          Incoming leads
        </h1>
        <p className="t-meta" style={{ marginTop: 4 }}>
          {leads.length} {leads.length === 1 ? "enquiry" : "enquiries"} total
        </p>
      </div>

      {error && (
        <div style={styles.errorBox}>
          Couldn&apos;t load leads: {error.message}
        </div>
      )}

      {!error && leads.length === 0 && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>
            <Inbox size={24} />
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: "14px 0 6px" }}>No leads yet</h2>
          <p className="t-meta">Enquiries from the contact form and viewing requests will appear here.</p>
        </div>
      )}

      {leads.length > 0 && (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Name", "Email", "Phone", "Message", "Property", "Received"].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{l.name}</td>
                  <td style={styles.td}>
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                  </td>
                  <td style={styles.td}>{l.phone || "—"}</td>
                  <td style={{ ...styles.td, maxWidth: 280, color: "var(--fg2)" }}>{l.message}</td>
                  <td style={styles.td}>{l.property_id ? `#${l.property_id}` : "—"}</td>
                  <td style={{ ...styles.td, whiteSpace: "nowrap", color: "var(--fg2)" }}>
                    {new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  errorBox: { padding: 16, borderRadius: 12, background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", color: "#C0392B", fontSize: 14 },
  empty: { textAlign: "center", padding: "70px 0" },
  emptyIcon: { width: 56, height: 56, borderRadius: 14, background: "var(--accent-tint)", color: "var(--accent)", display: "inline-grid", placeItems: "center" },
  tableCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflowX: "auto", boxShadow: "var(--shadow-sm)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 640 },
  th: { textAlign: "left", padding: "14px 16px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--fg2)", borderBottom: "1px solid var(--border)", background: "var(--bg)" },
  tr: { borderBottom: "1px solid var(--border)" },
  td: { padding: "14px 16px", verticalAlign: "top" },
};
