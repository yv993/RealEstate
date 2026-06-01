"use client";

import { useEffect, useState, CSSProperties } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const KEY = "evergreen:cookie";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  const choose = (v: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="evg-toast" style={wrap}>
      <span style={icon}>
        <Cookie size={18} />
      </span>
      <p style={{ flex: 1, fontSize: 13.5, lineHeight: 1.55, margin: 0, color: "var(--fg2)" }}>
        We use a little browser storage to remember your preferences. See our{" "}
        <Link href="/privacy" style={{ color: "var(--accent)", fontWeight: 600 }}>Privacy Policy</Link>.
      </p>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => choose("declined")} className="btn btn-ghost" style={{ fontSize: 13 }}>
          Decline
        </button>
        <button onClick={() => choose("accepted")} className="btn btn-primary btn-pill" style={{ fontSize: 13, padding: "9px 18px" }}>
          Accept
        </button>
      </div>
      <button onClick={() => choose("declined")} aria-label="Dismiss" style={dismiss}>
        <X size={15} />
      </button>
    </div>
  );
}

const wrap: CSSProperties = { position: "fixed", left: 20, bottom: 20, zIndex: 95, maxWidth: 440, width: "calc(100vw - 40px)", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-lg)" };
const icon: CSSProperties = { width: 34, height: 34, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 };
const dismiss: CSSProperties = { position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: 6, border: 0, background: "transparent", color: "var(--fg2)", display: "grid", placeItems: "center", cursor: "pointer" };
