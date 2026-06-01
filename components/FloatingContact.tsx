"use client";

import { useEffect, useState, CSSProperties } from "react";
import { MessageCircle, Send, Phone, X, Headset } from "lucide-react";
import { prefersReducedMotion } from "@/lib/gsap";

// Agency number: (+374) 10 539 853
const WA = "37410539853";
const TEL = "+37410539853";
const TG = "https://t.me/EverGreenArmenia";

const ACTIONS = [
  { label: "WhatsApp", Icon: MessageCircle, href: `https://wa.me/${WA}`, external: true },
  { label: "Telegram", Icon: Send, href: TG, external: true },
  { label: "Call us", Icon: Phone, href: `tel:${TEL}`, external: false },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = typeof window !== "undefined" && prefersReducedMotion();

  // Hide while a modal locks body scroll (e.g. the image lightbox).
  useEffect(() => {
    const check = () => setHidden(getComputedStyle(document.body).overflow === "hidden");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => obs.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <div style={wrap}>
      <div style={list}>
        {ACTIONS.map((a, i) => (
          <a
            key={a.label}
            href={a.href}
            aria-label={a.label}
            title={a.label}
            {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            style={{
              ...action,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
              pointerEvents: open ? "auto" : "none",
              transition: reduce ? "none" : `opacity 220ms var(--ease) ${open ? i * 55 : 0}ms, transform 220ms var(--ease) ${open ? i * 55 : 0}ms`,
            }}
            tabIndex={open ? 0 : -1}
          >
            <a.Icon size={20} />
          </a>
        ))}
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close contact menu" : "Contact us"}
        aria-expanded={open}
        style={fab}
      >
        {open ? <X size={22} /> : <Headset size={22} />}
      </button>
    </div>
  );
}

const wrap: CSSProperties = { position: "fixed", right: 24, bottom: 24, zIndex: 85, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 };
const list: CSSProperties = { display: "flex", flexDirection: "column", gap: 12, alignItems: "center" };
const action: CSSProperties = { width: 48, height: 48, borderRadius: 999, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--accent)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" };
const fab: CSSProperties = { width: 56, height: 56, borderRadius: 999, background: "var(--accent)", color: "#fff", border: 0, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "var(--shadow-lg)" };
