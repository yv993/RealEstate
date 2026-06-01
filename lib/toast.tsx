"use client";

import { createContext, useCallback, useContext, useState, CSSProperties } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };
type ToastCtx = { toast: (message: string, type?: ToastType) => void };

const Ctx = createContext<ToastCtx | null>(null);
let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++counter;
      setToasts((t) => [...t, { id, message, type }]);
      window.setTimeout(() => remove(id), 3800);
    },
    [remove]
  );

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={stack} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="evg-toast" style={{ ...card, ...accent(t.type) }}>
            <span style={{ display: "grid", placeItems: "center", color: color(t.type), flexShrink: 0 }}>
              {t.type === "success" ? <Check size={18} /> : t.type === "error" ? <AlertCircle size={18} /> : <Info size={18} />}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{t.message}</span>
            <button onClick={() => remove(t.id)} aria-label="Dismiss notification" style={closeBtn}>
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const c = useContext(Ctx);
  return c ?? { toast: () => {} };
}

const color = (t: ToastType) => (t === "success" ? "var(--success)" : t === "error" ? "#C0392B" : "var(--accent)");
const accent = (t: ToastType): CSSProperties => ({ borderLeft: `3px solid ${color(t)}` });

const stack: CSSProperties = { position: "fixed", top: "calc(var(--header-h) + 12px)", right: 20, zIndex: 300, display: "flex", flexDirection: "column", gap: 10, maxWidth: "calc(100vw - 40px)", width: 340, pointerEvents: "none" };
const card: CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-btn)", boxShadow: "var(--shadow-lg)", color: "var(--fg1)", pointerEvents: "auto" };
const closeBtn: CSSProperties = { width: 26, height: 26, borderRadius: 8, border: 0, background: "transparent", color: "var(--fg2)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 };
