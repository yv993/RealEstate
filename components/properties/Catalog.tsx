"use client";

import { useEffect, useMemo, useRef, useState, CSSProperties } from "react";
import { ChevronDown, Search, X, LayoutGrid, Map as MapIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { type Property } from "@/lib/data";
import { PropertyCard } from "../PropertyCard";
import { MapView } from "./MapView";
import { PriceRange } from "./PriceRange";
import { useCurrency } from "@/lib/currency";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const SORTS = ["Newest", "Price: Low to High", "Price: High to Low"];
const PAGE_SIZE = 9;
type Mode = "all" | "buy" | "rent";

function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button style={{ ...catStyles.field, ...(open ? catStyles.fieldOpen : {}) }} onClick={() => setOpen(!open)}>
        <span style={{ color: value ? "var(--fg1)" : "var(--fg2)" }}>{value || label}</span>
        <ChevronDown size={16} color="var(--fg2)" />
      </button>
      {open && (
        <div style={catStyles.panel}>
          {options.map((o) => (
            <button key={o} style={{ ...catStyles.opt, ...(o === value ? catStyles.optOn : {}) }} onClick={() => { onChange(o === value ? "" : o); setOpen(false); }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Catalog({ properties, initialListingType }: { properties: Property[]; initialListingType?: "sale" | "rent" }) {
  const all = properties;
  const { format } = useCurrency();
  const [mode, setMode] = useState<Mode>(initialListingType === "rent" ? "rent" : initialListingType === "sale" ? "buy" : "all");
  const [f, setF] = useState({ loc: "", type: "", beds: "", area: "" });
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState("Newest");
  const [view, setView] = useState<"list" | "map">("list");
  const [page, setPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  // Price bounds for the current Buy/Rent/All mode.
  const bounds = useMemo(() => {
    const pool = all.filter((p) => (mode === "buy" ? p.listingType === "sale" : mode === "rent" ? p.listingType === "rent" : true));
    if (pool.length === 0) return { min: 0, max: 1000, step: 10 };
    const prices = pool.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const step = max - min > 100000 ? 5000 : max - min > 5000 ? 500 : 50;
    return { min: Math.floor(min / step) * step, max: Math.ceil(max / step) * step, step };
  }, [all, mode]);

  const effPrice: [number, number] = price ?? [bounds.min, bounds.max];

  // ---- URL sync: read once on mount, write on change ----------------------
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const m = sp.get("mode");
    if (m === "buy" || m === "rent" || m === "all") setMode(m);
    setQuery(sp.get("q") ?? "");
    setF({ loc: sp.get("loc") ?? "", type: sp.get("type") ?? "", beds: sp.get("beds") ?? "", area: sp.get("area") ?? "" });
    if (sp.get("sort")) setSort(sp.get("sort")!);
    if (sp.get("view") === "map") setView("map");
    const pmin = sp.get("pmin");
    const pmax = sp.get("pmax");
    if (pmin && pmax) setPrice([Number(pmin), Number(pmax)]);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const sp = new URLSearchParams();
    if (mode !== "all") sp.set("mode", mode);
    if (query) sp.set("q", query);
    if (f.loc) sp.set("loc", f.loc);
    if (f.type) sp.set("type", f.type);
    if (f.beds) sp.set("beds", f.beds);
    if (f.area) sp.set("area", f.area);
    if (price && price[0] > bounds.min) sp.set("pmin", String(price[0]));
    if (price && price[1] < bounds.max) sp.set("pmax", String(price[1]));
    if (sort !== "Newest") sp.set("sort", sort);
    if (view !== "list") sp.set("view", view);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
  }, [mode, query, f, price, sort, view, hydrated, bounds]);

  // Reset the price range when the Buy/Rent mode changes (skip the first render).
  const firstMode = useRef(true);
  useEffect(() => {
    if (firstMode.current) {
      firstMode.current = false;
      return;
    }
    setPrice(null);
  }, [mode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const wantType = mode === "buy" ? "sale" : mode === "rent" ? "rent" : null;
    const minArea = f.area ? parseInt(f.area) : 0;
    let a = all.filter(
      (p) =>
        (!wantType || p.listingType === wantType) &&
        (!f.type || p.type === f.type) &&
        (!f.beds || p.beds >= parseInt(f.beds)) &&
        (!f.loc || p.location.includes(f.loc)) &&
        (!minArea || p.area >= minArea) &&
        p.price >= effPrice[0] &&
        p.price <= effPrice[1] &&
        (!q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
    );
    a = [...a];
    if (sort === "Price: Low to High") a.sort((x, y) => x.price - y.price);
    else if (sort === "Price: High to Low") a.sort((x, y) => y.price - x.price);
    return a;
  }, [all, f, query, sort, mode, effPrice]);

  // Reset to page 1 whenever the result set changes.
  useEffect(() => setPage(1), [f, query, sort, mode, price]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const startIdx = (pageClamped - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const hasFilters = query || f.loc || f.type || f.beds || f.area || price;

  const clearAll = () => {
    setF({ loc: "", type: "", beds: "", area: "" });
    setQuery("");
    setPrice(null);
  };

  // Re-animate cards when the visible set changes.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.children, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(el.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.06, overwrite: true });
  }, [pageClamped, sort, f, query, mode, view, effPrice]);

  const locs = [...new Set(all.map((p) => p.location.split(",").pop()!.trim()))];

  return (
    <>
      <div style={catStyles.modeRow}>
        {([{ k: "all", label: "All" }, { k: "buy", label: "Buy" }, { k: "rent", label: "Rent" }] as { k: Mode; label: string }[]).map((m) => (
          <button key={m.k} onClick={() => setMode(m.k)} style={{ ...catStyles.modeBtn, ...(mode === m.k ? catStyles.modeBtnOn : {}) }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="cat-bar" style={catStyles.barCard}>
        <div style={catStyles.searchWrap}>
          <Search size={16} color="var(--fg2)" />
          <input style={catStyles.searchInput} placeholder="Search by name or location…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Dropdown label="Location" value={f.loc} options={locs} onChange={(v) => set("loc", v)} />
        <Dropdown label="Type" value={f.type} options={["Apartment", "House", "Villa", "Estate"]} onChange={(v) => set("type", v)} />
        <Dropdown label="Bedrooms" value={f.beds} options={["3+", "4+", "5+"]} onChange={(v) => set("beds", v)} />
        <Dropdown label="Min area" value={f.area} options={["100+", "200+", "300+", "400+"]} onChange={(v) => set("area", v.replace("+", ""))} />
      </div>

      <div style={catStyles.priceCard}>
        <PriceRange min={bounds.min} max={bounds.max} step={bounds.step} value={effPrice} onChange={(v) => setPrice(v)} format={format} />
      </div>

      <div style={catStyles.toolbar}>
        <span className="t-meta">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"} available
          {hasFilters && (
            <button onClick={clearAll} style={catStyles.clear}>
              <X size={13} />
              Clear filters
            </button>
          )}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={catStyles.viewToggle}>
            <button onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} style={{ ...catStyles.viewBtn, ...(view === "list" ? catStyles.viewBtnOn : {}) }}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setView("map")} aria-label="Map view" aria-pressed={view === "map"} style={{ ...catStyles.viewBtn, ...(view === "map" ? catStyles.viewBtnOn : {}) }}>
              <MapIcon size={16} />
            </button>
          </div>
          <div style={{ width: 200 }}>
            <Dropdown label="Sort" value={sort} options={SORTS} onChange={(v) => setSort(v || "Newest")} />
          </div>
        </div>
      </div>

      {view === "map" ? (
        <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
          <MapView properties={filtered} height={600} />
        </div>
      ) : (
        <div ref={gridRef} className="cat-grid" style={catStyles.grid}>
          {visible.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {view === "list" && filtered.length === 0 && (
        <div style={catStyles.empty}>
          <p className="h-section" style={{ fontSize: 22, marginBottom: 8 }}>
            No properties match your filters
          </p>
          <p className="t-meta" style={{ marginBottom: 18 }}>Try widening your search or clearing a filter or two.</p>
          <button className="btn btn-outline btn-pill" onClick={clearAll}>Clear all filters</button>
        </div>
      )}

      {view === "list" && totalPages > 1 && (
        <div style={catStyles.pager}>
          <button className="btn btn-outline btn-pill" style={catStyles.pagerBtn} disabled={pageClamped === 1} onClick={() => setPage(pageClamped - 1)} aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} aria-label={`Page ${i + 1}`} aria-current={pageClamped === i + 1} style={{ ...catStyles.pageNum, ...(pageClamped === i + 1 ? catStyles.pageNumOn : {}) }}>
              {i + 1}
            </button>
          ))}
          <button className="btn btn-outline btn-pill" style={catStyles.pagerBtn} disabled={pageClamped === totalPages} onClick={() => setPage(pageClamped + 1)} aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}

const catStyles: Record<string, CSSProperties> = {
  modeRow: { maxWidth: "var(--content-max)", margin: "0 auto 16px", display: "inline-flex", gap: 4, padding: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999 },
  modeBtn: { padding: "8px 22px", borderRadius: 999, border: 0, background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--fg2)", cursor: "pointer", transition: "all 200ms var(--ease)" },
  modeBtnOn: { background: "var(--accent)", color: "#fff" },
  barCard: { maxWidth: "var(--content-max)", margin: "0 auto 14px", padding: 16, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-md)", display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 12, alignItems: "center" },
  searchWrap: { display: "flex", alignItems: "center", gap: 9, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-input)", padding: "0 13px" },
  searchInput: { flex: 1, border: 0, outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg1)", padding: "12px 0" },
  priceCard: { maxWidth: "var(--content-max)", margin: "0 auto 24px", padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-sm)" },
  field: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-input)", padding: "12px 14px", fontFamily: "var(--font-sans)", fontSize: 14, cursor: "pointer", transition: "border-color 200ms var(--ease)" },
  fieldOpen: { borderColor: "var(--accent)" },
  panel: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 6, zIndex: 30, display: "flex", flexDirection: "column", gap: 2 },
  opt: { textAlign: "left", border: 0, background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg1)", padding: "9px 12px", borderRadius: 8, cursor: "pointer" },
  optOn: { background: "var(--accent-tint)", color: "var(--accent-hover)", fontWeight: 600 },
  toolbar: { maxWidth: "var(--content-max)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" },
  viewToggle: { display: "inline-flex", gap: 3, padding: 3, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999 },
  viewBtn: { width: 38, height: 34, borderRadius: 999, border: 0, background: "transparent", color: "var(--fg2)", display: "grid", placeItems: "center", cursor: "pointer", transition: "all 200ms var(--ease)" },
  viewBtnOn: { background: "var(--accent)", color: "#fff" },
  clear: { display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 14, padding: 0, border: 0, background: "transparent", color: "var(--accent)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  grid: { maxWidth: "var(--content-max)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  empty: { textAlign: "center", padding: "70px 0", maxWidth: 420, margin: "0 auto" },
  pager: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 44 },
  pagerBtn: { width: 42, height: 42, padding: 0, justifyContent: "center" },
  pageNum: { minWidth: 42, height: 42, borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 200ms var(--ease)" },
  pageNumOn: { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" },
};
