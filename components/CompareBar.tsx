"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import { Scale, X } from "lucide-react";
import { useCompare } from "@/lib/compare";

// Floating bar that appears once the user has added properties to compare.
export function CompareBar() {
  const { count, clear, ready } = useCompare();
  if (!ready || count === 0) return null;

  return (
    <div style={styles.wrap}>
      <span style={styles.icon}>
        <Scale size={18} />
      </span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>
        {count} {count === 1 ? "property" : "properties"} to compare
      </span>
      <Link href="/compare" className="btn btn-primary btn-pill" style={{ padding: "9px 18px" }}>
        Compare
      </Link>
      <button onClick={clear} aria-label="Clear comparison" style={styles.clear}>
        <X size={16} />
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", zIndex: 90, display: "flex", alignItems: "center", gap: 14, padding: "12px 14px 12px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, boxShadow: "var(--shadow-lg)" },
  icon: { width: 36, height: 36, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center" },
  clear: { width: 34, height: 34, borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg2)", display: "grid", placeItems: "center", cursor: "pointer" },
};
