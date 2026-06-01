"use client";

import { CSSProperties } from "react";

type Props = {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format: (n: number) => string;
};

/** Dual-handle range slider built from two overlaid native range inputs. */
export function PriceRange({ min, max, step, value, onChange, format }: Props) {
  const [lo, hi] = value;
  const pct = (n: number) => (max === min ? 0 : ((n - min) / (max - min)) * 100);

  return (
    <div>
      <div style={labelRow}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Price
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-hover)" }}>
          {format(lo)} – {format(hi)}
        </span>
      </div>
      <div className="dual-range" style={track}>
        <div style={{ ...trackBase }} />
        <div style={{ ...trackFill, left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Minimum price"
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Maximum price"
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        />
      </div>
    </div>
  );
}

const labelRow: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 };
const track: CSSProperties = { position: "relative", height: 24, display: "flex", alignItems: "center" };
const trackBase: CSSProperties = { position: "absolute", left: 0, right: 0, height: 4, borderRadius: 999, background: "var(--border)" };
const trackFill: CSSProperties = { position: "absolute", height: 4, borderRadius: 999, background: "var(--accent)" };
