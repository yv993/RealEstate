"use client";

import { useEffect, useMemo, useRef, useState, CSSProperties } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, Tag, MapPin, BedDouble, ChevronDown, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { PROPERTIES } from "@/lib/data";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { BLUR_DATA_URL } from "@/lib/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "../motion/useIsoLayoutEffect";
import { Magnetic } from "../motion/Magnetic";
import { PointerParallax } from "../motion/PointerParallax";

// Armenia scenery: Ararat-like peak, Lake Sevan, highland valley, Dilijan forest.
const SLIDES: { src: string; alt: string }[] = [
  { src: sceneUrl("araratPeak"), alt: SCENES.araratPeak.alt },
  { src: sceneUrl("lakeSevan"), alt: SCENES.lakeSevan.alt },
  { src: sceneUrl("valley"), alt: SCENES.valley.alt },
  { src: sceneUrl("dilijanForest"), alt: SCENES.dilijanForest.alt },
];

function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  const n = SLIDES.length;
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  const go = (next: number) => setIdx((next + n) % n);

  // Auto-advance.
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  // Slide + Ken-Burns the active image in.
  useEffect(() => {
    const el = imgs.current[idx];
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { xPercent: 5, scale: 1.12, opacity: 0 },
      { xPercent: 0, scale: 1, opacity: 1, duration: 6, ease: "power2.out", overwrite: true }
    );
  }, [idx]);

  return (
    <div style={ssStyles.clip}>
      <PointerParallax strength={12} scale={1.06} style={{ position: "absolute", inset: 0 }}>
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            ref={(el) => {
              imgs.current[i] = el;
            }}
            src={slide.src}
            alt={i === idx ? slide.alt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            style={{ ...ssStyles.img, opacity: i === idx ? 1 : 0 }}
          />
        ))}
      </PointerParallax>
      <div style={ssStyles.scrim} />
      <div style={ssStyles.controls}>
        <div style={ssStyles.dots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              style={{ ...ssStyles.dot, ...(i === idx ? ssStyles.dotOn : {}) }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={ssStyles.arrow} onClick={() => go(idx - 1)} aria-label="Previous slide">
            <ArrowLeft size={18} />
          </button>
          <button style={ssStyles.arrow} onClick={() => go(idx + 1)} aria-label="Next slide">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-chip", { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, 0.1)
        .from(".hero-title", { opacity: 0, y: 30, duration: 0.9 }, 0.2)
        .from(".hero-sub", { opacity: 0, y: 22, duration: 0.8 }, 0.4)
        .from(".hero-search", { opacity: 0, y: 34, duration: 0.9 }, 0.55);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={heroStyles.wrap}>
      <HeroSlideshow />
      <div className="wrap" style={heroStyles.content}>
        <div style={heroStyles.chips}>
          {["Apartment", "House", "Villa"].map((c, i) => (
            <span key={c} className="hero-chip" style={{ ...heroStyles.chip, ...(i === 0 ? heroStyles.chipOn : {}) }}>
              {c}
            </span>
          ))}
        </div>
        <h1 className="h-hero hero-title" style={heroStyles.title}>
          Find Your Place in the
          <br />
          Heart of <span style={{ fontStyle: "italic" }}>Armenia</span>.
        </h1>
        <p className="hero-sub" style={heroStyles.sub}>
          Curated homes across Yerevan, Dilijan, Tsaghkadzor and Lake Sevan — to buy or rent.
          Thoughtful design, prime locations, and people who know Armenia, chosen with care.
        </p>
      </div>
      <div className="wrap">
        <div className="hero-search">
          <PointerParallax strength={-8}>
            <SearchCard />
          </PointerParallax>
        </div>
      </div>
    </section>
  );
}

const PRICE_OPTIONS: { label: string; min?: number; max?: number }[] = [
  { label: "Any price" },
  { label: "Under $200k", max: 200000 },
  { label: "$200k – $400k", min: 200000, max: 400000 },
  { label: "$400k and up", min: 400000 },
];

function SearchSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: typeof Home;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label style={searchStyles.field}>
      <span style={searchStyles.fieldLabel}>{label}</span>
      <div style={searchStyles.fieldInner}>
        <Icon size={16} color="var(--fg2)" />
        <select value={value} onChange={(e) => onChange(e.target.value)} style={searchStyles.select} aria-label={label}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} color="var(--fg2)" style={{ marginLeft: "auto", pointerEvents: "none" }} />
      </div>
    </label>
  );
}

function SearchCard() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [priceIdx, setPriceIdx] = useState("0");
  const [loc, setLoc] = useState("");
  const [beds, setBeds] = useState("");
  const locations = useMemo(() => [...new Set(PROPERTIES.map((p) => p.location))], []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (type) sp.set("type", type);
    if (loc.trim()) sp.set("loc", loc.trim());
    if (beds) sp.set("beds", beds);
    const pr = PRICE_OPTIONS[Number(priceIdx)] ?? PRICE_OPTIONS[0];
    if (pr.min) sp.set("pmin", String(pr.min));
    if (pr.max) sp.set("pmax", String(pr.max));
    const qs = sp.toString();
    router.push(`/properties${qs ? `?${qs}` : ""}`);
  };

  return (
    <form onSubmit={submit} style={searchStyles.card}>
      <div style={searchStyles.head}>Find the best place</div>
      <div className="search-grid" style={searchStyles.grid}>
        <SearchSelect label="Looking for" icon={Home} value={type} onChange={setType} options={[{ value: "", label: "Any type" }, { value: "Apartment", label: "Apartment" }, { value: "House", label: "House" }, { value: "Villa", label: "Villa" }, { value: "Estate", label: "Estate" }]} />
        <SearchSelect label="Price" icon={Tag} value={priceIdx} onChange={setPriceIdx} options={PRICE_OPTIONS.map((o, i) => ({ value: String(i), label: o.label }))} />
        <label style={searchStyles.field}>
          <span style={searchStyles.fieldLabel}>Location</span>
          <div style={searchStyles.fieldInner}>
            <MapPin size={16} color="var(--fg2)" />
            <input list="hero-locs" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Any location" style={searchStyles.input} aria-label="Location" />
          </div>
          <datalist id="hero-locs">
            {locations.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </label>
        <SearchSelect label="Number of rooms" icon={BedDouble} value={beds} onChange={setBeds} options={[{ value: "", label: "Any rooms" }, { value: "3", label: "3+ bedrooms" }, { value: "4", label: "4+ bedrooms" }, { value: "5", label: "5+ bedrooms" }]} />
      </div>
      <div style={searchStyles.foot}>
        <div style={searchStyles.filterRow}>
          <span style={searchStyles.filterLabel}>Popular:</span>
          {["Yerevan", "Dilijan", "Sevan", "Gyumri"].map((f) => (
            <button type="button" key={f} onClick={() => setLoc(f)} style={{ ...searchStyles.fchip, ...(loc === f ? searchStyles.fchipOn : {}) }}>
              {f}
            </button>
          ))}
        </div>
        <Magnetic>
          <button type="submit" className="btn btn-primary btn-pill">
            <Search size={16} />
            Search Properties
          </button>
        </Magnetic>
      </div>
    </form>
  );
}

const ssStyles: Record<string, CSSProperties> = {
  clip: { position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 },
  img: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 1.1s var(--ease)" },
  scrim: { position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,18,14,0.74) 0%, rgba(15,18,14,0.42) 45%, rgba(15,18,14,0.18) 100%)" },
  controls: { position: "absolute", right: 32, top: 96, zIndex: 3, display: "flex", alignItems: "center", gap: 16 },
  dots: { display: "flex", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, border: 0, background: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 0, transition: "all 250ms var(--ease)" },
  dotOn: { width: 24, background: "#fff" },
  arrow: { width: 42, height: 42, borderRadius: 999, border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.14)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(6px)" },
};

const heroStyles: Record<string, CSSProperties> = {
  wrap: { position: "relative", paddingTop: 120, paddingBottom: 70, minHeight: 640, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 36 },
  content: { position: "relative", zIndex: 2 },
  chips: { display: "flex", gap: 10, marginBottom: 22 },
  chip: { padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, color: "#fff", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)" },
  chipOn: { background: "#fff", color: "var(--fg1)" },
  title: { color: "#fff", fontSize: "clamp(40px, 5.4vw, 62px)", maxWidth: 760 },
  sub: { color: "rgba(255,255,255,0.86)", fontSize: 16.5, lineHeight: 1.6, maxWidth: 540, marginTop: 18 },
};

const searchStyles: Record<string, CSSProperties> = {
  card: { position: "relative", zIndex: 2, background: "var(--surface)", borderRadius: 18, boxShadow: "var(--shadow-lg)", padding: 22 },
  head: { fontSize: 18, fontWeight: 600, marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 7, padding: "2px 0" },
  fieldLabel: { fontSize: 12, fontWeight: 600, color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.04em" },
  fieldInner: { display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", border: "1px solid var(--border)", borderRadius: "var(--radius-input)", background: "var(--bg)" },
  fieldValue: { fontSize: 14, color: "var(--fg1)" },
  select: { flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg1)", cursor: "pointer", appearance: "none", WebkitAppearance: "none" },
  input: { flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--fg1)" },
  foot: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 18, flexWrap: "wrap" },
  filterRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  filterLabel: { fontSize: 13, color: "var(--fg2)", marginRight: 4 },
  fchip: { padding: "7px 15px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--fg2)", cursor: "pointer", transition: "all 200ms var(--ease)" },
  fchipOn: { background: "var(--accent-tint)", border: "1px solid var(--accent)", color: "var(--accent-hover)" },
};
