import { CSSProperties } from "react";
import { STATS } from "@/lib/data";
import { CountUp } from "../motion/CountUp";
import { RevealStagger } from "../motion/RevealStagger";

export function StatsBand() {
  return (
    <section style={statStyles.band}>
      <RevealStagger className="wrap stat-row" style={statStyles.row} y={20} stagger={0.1}>
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="stat-cell"
            style={{ ...statStyles.cell, borderLeft: i ? "1px solid var(--border)" : "none" }}
          >
            <div style={statStyles.num}>
              <CountUp end={s.value} suffix={s.suffix} />
            </div>
            <div className="t-meta">{s.label}</div>
          </div>
        ))}
      </RevealStagger>
    </section>
  );
}

const statStyles: Record<string, CSSProperties> = {
  band: { background: "var(--bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "44px 0" },
  row: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)" },
  cell: { textAlign: "center", padding: "8px 16px" },
  num: { fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg1)", marginBottom: 4 },
};
