"use client";

import { useState, CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Trees, Lock, Mail, Loader2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AdminNotice } from "@/components/admin/AdminNotice";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured()) return <AdminNotice />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.card}>
        <span style={styles.mark}>
          <Trees size={20} />
        </span>
        <h1 style={styles.title}>Agency sign in</h1>
        <p className="t-meta" style={{ textAlign: "center", marginBottom: 22 }}>
          Manage listings and view incoming leads.
        </p>

        <label style={styles.label}>Email</label>
        <div style={styles.inputWrap}>
          <Mail size={17} color="var(--fg2)" style={styles.icon} />
          <input className="field" style={styles.input} type="email" value={email} placeholder="you@evergreen.com" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <label style={styles.label}>Password</label>
        <div style={styles.inputWrap}>
          <Lock size={17} color="var(--fg2)" style={styles.icon} />
          <input className="field" style={styles.input} type="password" value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <span style={styles.err}>{error}</span>}

        <button type="submit" disabled={busy} className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>
          {busy ? <Loader2 size={16} className="spin" /> : null}
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg)" },
  card: { width: "100%", maxWidth: 400, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 34, boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column" },
  mark: { width: 48, height: 48, borderRadius: 12, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 16px" },
  title: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, textAlign: "center", margin: "0 0 4px" },
  label: { fontSize: 13, fontWeight: 600, marginBottom: 7 },
  inputWrap: { position: "relative", marginBottom: 16 },
  icon: { position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  input: { width: "100%", fontSize: 14.5, paddingLeft: 38 },
  err: { fontSize: 13, color: "#C0392B", marginTop: 2 },
};
