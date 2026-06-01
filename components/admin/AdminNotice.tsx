import Link from "next/link";
import { Database } from "lucide-react";

// Shown when Supabase env vars are missing, so the admin area never crashes.
export function AdminNotice() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, background: "var(--bg)" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <span style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent-tint)", color: "var(--accent)", display: "inline-grid", placeItems: "center", marginBottom: 18 }}>
          <Database size={24} />
        </span>
        <h1 className="h-section" style={{ fontSize: 26, marginBottom: 10 }}>
          Admin area needs Supabase
        </h1>
        <p className="lead" style={{ margin: "0 auto 20px" }}>
          Add your Supabase keys to <code>.env.local</code> and run the SQL in{" "}
          <code>supabase/schema.sql</code> to switch on login, leads, and listing
          management. See <code>SETUP.md</code> for the step-by-step.
        </p>
        <Link href="/" className="btn btn-outline btn-pill">
          Back to site
        </Link>
      </div>
    </div>
  );
}
