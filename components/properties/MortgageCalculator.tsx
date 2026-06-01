"use client";

import { useMemo, useState, CSSProperties } from "react";
import { Calculator } from "lucide-react";
import { useCurrency } from "@/lib/currency";

const TERMS = [10, 15, 20, 30];

export function MortgageCalculator({ price }: { price: number }) {
  const { format: usd } = useCurrency();
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(7);
  const [term, setTerm] = useState(20);

  const { monthly, loan, totalInterest, totalCost } = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = Math.max(price - down, 0);
    const n = term * 12;
    const r = rate / 100 / 12;
    const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
    const totalCost = monthly * n;
    return { monthly, loan, totalInterest: totalCost - loan, totalCost };
  }, [price, downPct, rate, term]);

  return (
    <div style={s.card}>
      <div style={s.head}>
        <span style={s.headIcon}>
          <Calculator size={18} />
        </span>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Estimate your monthly payment</h3>
          <p className="t-meta" style={{ margin: "2px 0 0" }}>A rough guide — not a loan offer.</p>
        </div>
      </div>

      <div className="mortgage-grid" style={s.grid}>
        {/* Controls */}
        <div style={s.controls}>
          <div style={s.control}>
            <div style={s.controlTop}>
              <label htmlFor="mc-down" style={s.label}>Down payment</label>
              <span style={s.controlVal}>
                {downPct}% · {usd((price * downPct) / 100)}
              </span>
            </div>
            <input
              id="mc-down"
              type="range"
              min={0}
              max={50}
              step={1}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              style={s.range}
            />
          </div>

          <div style={s.control}>
            <div style={s.controlTop}>
              <label htmlFor="mc-rate" style={s.label}>Interest rate</label>
              <span style={s.controlVal}>{rate.toFixed(1)}%</span>
            </div>
            <input
              id="mc-rate"
              type="range"
              min={1}
              max={15}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              style={s.range}
            />
          </div>

          <div style={s.control}>
            <span style={s.label}>Loan term</span>
            <div style={s.terms}>
              {TERMS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  style={{ ...s.term, ...(t === term ? s.termOn : {}) }}
                >
                  {t} yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={s.result}>
          <span className="t-label" style={{ color: "var(--fg2)" }}>Estimated monthly</span>
          <div style={s.monthly}>
            {usd(monthly)}
            <span style={{ fontSize: 16, fontWeight: 500, color: "var(--fg2)" }}> / mo</span>
          </div>
          <div style={s.breakdown}>
            <Row label="Loan amount" value={usd(loan)} />
            <Row label="Total interest" value={usd(totalInterest)} />
            <Row label="Total cost" value={usd(totalCost)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.row}>
      <span className="t-meta">{label}</span>
      <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 28, boxShadow: "var(--shadow-sm)" },
  head: { display: "flex", alignItems: "center", gap: 14, marginBottom: 22 },
  headIcon: { width: 44, height: 44, borderRadius: 12, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 },
  grid: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, alignItems: "stretch" },
  controls: { display: "flex", flexDirection: "column", gap: 22 },
  control: { display: "flex", flexDirection: "column", gap: 10 },
  controlTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: "var(--fg1)" },
  controlVal: { fontSize: 13, fontWeight: 600, color: "var(--accent-hover)" },
  range: { width: "100%", accentColor: "var(--accent)", cursor: "pointer" },
  terms: { display: "flex", gap: 8, flexWrap: "wrap" },
  term: { flex: 1, minWidth: 56, padding: "9px 0", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, color: "var(--fg2)", cursor: "pointer", transition: "all 200ms var(--ease)" },
  termOn: { background: "var(--accent-tint)", border: "1px solid var(--accent)", color: "var(--accent-hover)", fontWeight: 600 },
  result: { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "center" },
  monthly: { fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg1)", margin: "4px 0 16px" },
  breakdown: { display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 16 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
};
