"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, BedDouble, Bath, Maximize, Maximize2, Car, CalendarDays, Home, Check, MapPin, Heart, Share2, CheckCheck } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/image";
import { type Property } from "@/lib/data";
import { Price } from "../Price";
import { useFavorites } from "@/lib/favorites";
import { recordRecent } from "@/lib/recent";
import { agentForProperty } from "@/lib/agents";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "../motion/Reveal";
import { RevealStagger } from "../motion/RevealStagger";
import { RequestViewing } from "./RequestViewing";
import { MapView } from "./MapView";
import { LazyOnVisible } from "../motion/LazyOnVisible";
import { PropertyCard } from "../PropertyCard";

// Below-the-fold + interactive: load only on the client when reached.
const MortgageCalculator = dynamic(() => import("./MortgageCalculator").then((m) => m.MortgageCalculator), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: 280, borderRadius: 16 }} />,
});

// Only loaded the moment the user opens the fullscreen gallery.
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

export function PropertyDetail({ p, all = [] }: { p: Property; all?: Property[] }) {
  const images = p.gallery && p.gallery.length ? p.gallery : [p.img];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggle, ready } = useFavorites();
  const fav = ready && isFavorite(p.id);
  const dir = useRef(1);
  const mainRef = useRef<HTMLImageElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const selectThumb = (i: number) => {
    dir.current = i >= active ? 1 : -1;
    setActive(i);
  };

  // Remember this property as recently viewed.
  useEffect(() => {
    recordRecent(p.id);
  }, [p.id]);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: p.title, text: `${p.title} — ${p.location}`, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* user cancelled share */
    }
  };

  const similar = all
    .filter((x) => x.id !== p.id && x.listingType === p.listingType)
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 3);

  const agent = agentForProperty(p.id);

  // Entrance: main image + thumbnails fade/scale in.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".pd-main", { opacity: 0, scale: 1.04, duration: 0.8, ease: "power3.out" });
      gsap.from(".pd-thumb", { opacity: 0, y: 14, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.15 });
    }, galleryRef);
    return () => ctx.revert();
  }, []);

  // Slide the main image in from the side whenever a thumbnail is selected.
  useEffect(() => {
    if (prefersReducedMotion() || !mainRef.current) return;
    gsap.fromTo(
      mainRef.current,
      { opacity: 0.2, xPercent: dir.current * 14 },
      { opacity: 1, xPercent: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [active]);

  const stats = [
    { Icon: BedDouble, label: "Bedrooms", value: p.beds },
    { Icon: Bath, label: "Bathrooms", value: p.baths },
    { Icon: Maximize, label: "Area", value: `${p.area} m²` },
    { Icon: Car, label: "Garage", value: p.garage },
    { Icon: CalendarDays, label: "Year built", value: p.yearBuilt },
    { Icon: Home, label: "Type", value: p.type },
  ];

  const badgeClass =
    p.badge === "Available" ? "badge badge-success" : p.badge === "New" ? "badge" : "badge badge-dark";
  const badgeStyle: CSSProperties =
    p.badge === "New" ? { background: "var(--surface)", color: "var(--fg1)", border: "1px solid var(--border)" } : {};

  return (
    <div className="wrap" style={{ paddingTop: "calc(var(--header-h) + 28px)", paddingBottom: 80 }}>
      <nav aria-label="Breadcrumb" style={dStyles.crumbs}>
        <Link href="/" style={dStyles.crumbLink}>Home</Link>
        <ChevronRight size={14} />
        <Link href={p.listingType === "rent" ? "/rent" : "/properties"} style={dStyles.crumbLink}>
          {p.listingType === "rent" ? "For Rent" : "Properties"}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: "var(--fg1)", fontWeight: 500 }}>{p.title}</span>
      </nav>

      <div className="pd-grid" style={dStyles.grid}>
        {/* Gallery */}
        <div ref={galleryRef}>
          <button style={dStyles.mainWrap} onClick={() => setLightbox(true)} aria-label="Open fullscreen gallery">
            <span style={dStyles.zoomCue} aria-hidden>
              <Maximize2 size={16} />
            </span>
            <Image
              ref={mainRef}
              className="pd-main"
              src={images[active]}
              alt={p.title}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 60vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={dStyles.mainImg}
            />
            <span className={badgeClass} style={{ ...dStyles.badge, ...badgeStyle }}>
              {p.badge}
            </span>
          </button>
          <div className="pd-thumbs" style={dStyles.thumbRow}>
            {images.map((src, i) => (
              <button
                key={src + i}
                className="pd-thumb"
                onClick={() => selectThumb(i)}
                aria-label={`View image ${i + 1}`}
                style={{ ...dStyles.thumb, ...(i === active ? dStyles.thumbOn : {}) }}
              >
                <Image src={src} alt="" fill sizes="120px" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={dStyles.thumbImg} />
              </button>
            ))}
          </div>
        </div>

        {/* Info card */}
        <Reveal style={dStyles.infoCard} x={24}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div className="t-label" style={{ color: "var(--accent)" }}>
              {p.type}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={share} aria-label="Share this property" style={dStyles.saveBtn}>
                {copied ? <CheckCheck size={16} /> : <Share2 size={16} />}
                {copied ? "Copied" : "Share"}
              </button>
              <button
                onClick={() => toggle(p.id)}
                aria-label={fav ? "Remove from saved" : "Save property"}
                aria-pressed={fav}
                style={{ ...dStyles.saveBtn, ...(fav ? dStyles.saveBtnOn : {}) }}
              >
                <Heart size={16} fill={fav ? "var(--accent)" : "none"} color={fav ? "var(--accent)" : "currentColor"} />
                {fav ? "Saved" : "Save"}
              </button>
            </div>
          </div>
          <h1 className="h-section" style={{ fontSize: 30, margin: "8px 0 10px" }}>
            {p.title}
          </h1>
          <div style={dStyles.loc}>
            <MapPin size={15} />
            {p.location}
          </div>
          <div style={dStyles.price}><Price p={p} /></div>

          <div style={dStyles.statGrid}>
            {stats.map((s) => (
              <div key={s.label} style={dStyles.statCell}>
                <span style={dStyles.statIcon}>
                  <s.Icon size={18} />
                </span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.value}</div>
                  <div className="t-meta" style={{ fontSize: 12.5 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="inquire" style={{ scrollMarginTop: 90 }} />
          <RequestViewing propertyId={p.id} propertyTitle={p.title} isRent={p.listingType === "rent"} />

          <Link href="/agents" style={dStyles.agentBlock}>
            <Image src={agent.img} alt={agent.name} width={48} height={48} style={dStyles.agentImg} />
            <div>
              <div className="t-label" style={{ color: "var(--fg2)" }}>Your agent</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{agent.name}</div>
              <div className="t-meta" style={{ fontSize: 12.5 }}>{agent.role}</div>
            </div>
          </Link>
        </Reveal>
      </div>

      {/* Description + features */}
      <div className="pd-lower" style={dStyles.lower}>
        <Reveal>
          <h2 className="h-section" style={{ fontSize: 24, marginBottom: 14 }}>
            About this property
          </h2>
          <p className="lead" style={{ maxWidth: "60ch" }}>
            {p.description}
          </p>
        </Reveal>
        <Reveal delay={0.1} style={dStyles.featCard}>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>Features</h3>
          <div style={dStyles.featGrid}>
            {p.features.map((f) => (
              <div key={f} style={dStyles.feat}>
                <span style={dStyles.featIcon}>
                  <Check size={13} />
                </span>
                {f}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {p.listingType === "sale" && (
        <Reveal style={{ marginTop: 40 }}>
          <MortgageCalculator price={p.price} />
        </Reveal>
      )}

      <Reveal style={{ marginTop: 40 }}>
        <h2 className="h-section" style={{ fontSize: 22, marginBottom: 16 }}>
          Location
        </h2>
        <LazyOnVisible minHeight={320}>
          <MapView properties={[p]} single height={320} zoom={13} />
        </LazyOnVisible>
      </Reveal>

      {similar.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <h2 className="h-section" style={{ fontSize: 24, marginBottom: 24 }}>
            Similar properties
          </h2>
          <RevealStagger className="similar-grid" style={dStyles.similarGrid} stagger={0.1} y={28}>
            {similar.map((sp) => (
              <PropertyCard key={sp.id} p={sp} />
            ))}
          </RevealStagger>
        </div>
      )}

      {lightbox && (
        <Lightbox
          images={images}
          index={active}
          title={p.title}
          onClose={() => setLightbox(false)}
          onIndex={(i) => setActive(i)}
        />
      )}
    </div>
  );
}

const dStyles: Record<string, CSSProperties> = {
  crumbs: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--fg2)", marginBottom: 22, flexWrap: "wrap" },
  crumbLink: { color: "var(--fg2)" },
  grid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" },
  mainWrap: { position: "relative", display: "block", width: "100%", padding: 0, border: 0, borderRadius: "var(--radius-card)", overflow: "hidden", aspectRatio: "16 / 11", background: "var(--border)", boxShadow: "var(--shadow-md)", cursor: "zoom-in" },
  zoomCue: { position: "absolute", top: 16, right: 16, zIndex: 2, width: 36, height: 36, borderRadius: 999, background: "rgba(15,18,14,0.55)", color: "#fff", display: "grid", placeItems: "center", backdropFilter: "blur(4px)" },
  similarGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
  mainImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  badge: { position: "absolute", top: 16, left: 16 },
  thumbRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 12 },
  thumb: { position: "relative", padding: 0, border: "2px solid transparent", borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "var(--border)", aspectRatio: "4 / 3", transition: "border-color 200ms var(--ease), transform 200ms var(--ease)" },
  thumbOn: { border: "2px solid var(--accent)" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  infoCard: { position: "sticky", top: "calc(var(--header-h) + 24px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 28, boxShadow: "var(--shadow-md)" },
  loc: { display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--fg2)" },
  price: { fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--fg1)", margin: "16px 0 4px" },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "22px 0 24px", paddingTop: 22, borderTop: "1px solid var(--border)" },
  statCell: { display: "flex", alignItems: "center", gap: 12 },
  statIcon: { width: 40, height: 40, borderRadius: 10, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 },
  lower: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start", marginTop: 56 },
  featCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 26 },
  featGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  feat: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500 },
  featIcon: { width: 22, height: 22, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 },
  saveBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 200ms var(--ease)" },
  saveBtnOn: { background: "var(--accent-tint)", border: "1px solid var(--accent)", color: "var(--accent-hover)" },
  agentBlock: { display: "flex", alignItems: "center", gap: 12, marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)", textDecoration: "none", color: "var(--fg1)" },
  agentImg: { width: 48, height: 48, borderRadius: 999, objectFit: "cover", flexShrink: 0 },
};
