"use client";

import { CSSProperties } from "react";
import { useCurrency, type Currency } from "@/lib/currency";
import { track } from "@/lib/track";

export function CurrencyToggle() {
  const { currency, setCurrency, ready } = useCurrency();
  return (
    <div style={wrap} role="group" aria-label="Currency">
      {(["AMD", "USD"] as Currency[]).map((c) => {
        const on = ready && currency === c;
        return (
          <button
            key={c}
            onClick={() => {
              setCurrency(c);
              track("currency_changed", { currency: c });
            }}
            aria-pressed={on}
            style={{ ...btn, ...(on ? btnOn : {}) }}
            suppressHydrationWarning
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

const wrap: CSSProperties = { display: "inline-flex", gap: 2, padding: 3, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999 };
const btn: CSSProperties = { padding: "5px 10px", borderRadius: 999, border: 0, background: "transparent", color: "var(--fg2)", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all 200ms var(--ease)" };
const btnOn: CSSProperties = { background: "var(--accent)", color: "#fff" };
