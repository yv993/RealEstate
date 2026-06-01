"use client";

import { useState, CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, LogOut, Trees } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Leads", Icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", Icon: Building2 },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    try {
      await createSupabaseBrowserClient().auth.signOut();
    } catch {}
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={styles.bar}>
        <div style={styles.inner}>
          <Link href="/" style={styles.logo}>
            <span style={styles.mark}>
              <Trees size={16} />
            </span>
            EverGreen <span style={{ color: "var(--fg2)", fontWeight: 500, fontSize: 14 }}>Admin</span>
          </Link>
          <nav style={styles.nav}>
            {LINKS.map(({ href, label, Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link key={href} href={href} style={{ ...styles.link, ...(active ? styles.linkOn : {}) }}>
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div style={styles.right}>
            <span className="t-meta" style={{ fontSize: 13 }}>
              {email}
            </span>
            <button onClick={logout} disabled={busy} style={styles.logout}>
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  bar: { position: "sticky", top: 0, zIndex: 40, background: "var(--surface)", borderBottom: "1px solid var(--border)" },
  inner: { maxWidth: 1100, margin: "0 auto", height: 64, padding: "0 24px", display: "flex", alignItems: "center", gap: 24 },
  logo: { display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, color: "var(--fg1)" },
  mark: { width: 30, height: 30, borderRadius: 9, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center" },
  nav: { display: "flex", gap: 6, marginLeft: 16 },
  link: { display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, fontSize: 14, fontWeight: 500, color: "var(--fg2)" },
  linkOn: { background: "var(--accent-tint)", color: "var(--accent-hover)" },
  right: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 },
  logout: { display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, cursor: "pointer" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px 60px" },
};
