import { CSSProperties } from "react";
import Link from "next/link";
import { Navigation } from "lucide-react";
import { Reveal } from "../motion/Reveal";
import { PointerParallax } from "../motion/PointerParallax";

export function MapBand() {
  return (
    <section style={mapStyles.band}>
      <div className="wrap map-grid" style={mapStyles.grid}>
        <Reveal style={mapStyles.mapWrap} x={-30}>
          <PointerParallax strength={6} scale={1.05}>
            <MapGraphic />
          </PointerParallax>
        </Reveal>
        <Reveal delay={0.1} style={mapStyles.textCol} x={30}>
          <p className="eyebrow">Local expertise</p>
          <h2 className="h-section" style={{ fontSize: 32 }}>
            Find Value Across Every Region of Armenia
          </h2>
          <p className="lead" style={{ marginTop: 14 }}>
            From the avenues of central Yerevan to the forests of Dilijan and the shores of Lake
            Sevan — we know each district and region, and surface the right home in it.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <Link href="/properties" className="btn btn-primary btn-pill">
              <Navigation size={16} />
              Find Nearest Properties
            </Link>
            <Link href="/locations" className="btn btn-outline btn-pill">
              Browse by neighbourhood
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Animated SVG "map" with drawn routes + pulsing pin
function MapGraphic() {
  return (
    <svg viewBox="0 0 520 340" style={{ width: "100%", display: "block" }} role="img" aria-label="Map">
      <rect width="520" height="340" rx="16" fill="var(--map-bg)" />
      <g stroke="var(--map-grid)" strokeWidth="2" fill="none">
        <path d="M0 90 H520" />
        <path d="M0 200 H520" />
        <path d="M0 280 H520" />
        <path d="M130 0 V340" />
        <path d="M300 0 V340" />
        <path d="M420 0 V340" />
      </g>
      <g fill="var(--map-block)">
        <rect x="20" y="20" width="90" height="55" rx="6" />
        <rect x="150" y="105" width="130" height="80" rx="6" />
        <rect x="320" y="30" width="80" height="45" rx="6" />
        <rect x="440" y="215" width="60" height="55" rx="6" />
        <rect x="30" y="215" width="80" height="50" rx="6" />
      </g>
      <path
        d="M60 300 C 160 300, 180 150, 300 150 S 470 70, 470 70"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="240"
        style={{ animation: "drift 2.6s var(--ease) forwards" }}
      />
      <g transform="translate(300,150)">
        <circle r="10" fill="var(--accent)" opacity="0.25" style={{ transformOrigin: "center", animation: "pulse-ring 2.4s ease-out infinite" }} />
        <circle r="6" fill="var(--accent)" />
        <circle r="2.4" fill="#fff" />
      </g>
      <g transform="translate(150,255)">
        <rect x="-44" y="-16" width="88" height="30" rx="15" fill="var(--surface)" stroke="var(--border)" />
        <text x="0" y="4" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="12" fontWeight="600" fill="var(--fg1)">
          Dream Home
        </text>
      </g>
    </svg>
  );
}

const mapStyles: Record<string, CSSProperties> = {
  band: { background: "var(--band)", padding: "64px 0" },
  grid: { display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" },
  mapWrap: { borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" },
  textCol: {},
};
