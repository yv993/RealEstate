"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import Link from "next/link";
import { Trees, Search, Menu, X, Heart } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencyToggle } from "./CurrencyToggle";
import { useFavorites } from "@/lib/favorites";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Property List", href: "/properties" },
  { label: "For Rent", href: "/rent" },
  { label: "Contact Us", href: "/contact" },
];

export function Nav({ active }: { active?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const { count, ready } = useFavorites();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const el = barRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { y: -90 },
      { y: 0, duration: 0.9, ease: "power3.out", delay: 0.05 }
    );
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      ref={barRef}
      style={{
        ...navStyles.bar,
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div style={navStyles.inner}>
        <Link href="/" style={navStyles.logo}>
          <span style={navStyles.mark}>
            <Trees size={18} />
          </span>
          EverGreen
        </Link>
        <nav className="evg-navpill" style={navStyles.navPill}>
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={"navlink" + (active === n.label ? " active" : "")}
              style={{ ...navStyles.link, ...(active === n.label ? navStyles.linkActive : {}) }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={navStyles.right}>
          <span className="nav-hide-sm">
            <CurrencyToggle />
          </span>
          <ThemeToggle />
          <Link href="/saved" aria-label="Saved properties" style={{ ...navStyles.iconBtn, position: "relative" }}>
            <Heart size={18} fill={ready && count > 0 ? "var(--accent)" : "none"} color={ready && count > 0 ? "var(--accent)" : "currentColor"} />
            {ready && count > 0 && <span style={navStyles.favBadge}>{count}</span>}
          </Link>
          <Link href="/properties" aria-label="Search" className="nav-hide-sm" style={navStyles.iconBtn}>
            <Search size={18} />
          </Link>
          <Link href="/signup" className="btn btn-primary btn-pill">
            Sign Up
          </Link>
          <button
            className="evg-burger"
            style={navStyles.burger}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div style={navStyles.mobileMenu}>
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{ ...navStyles.mLink, ...(active === n.label ? { color: "var(--accent)" } : {}) }}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/signup" className="btn btn-primary" style={{ justifyContent: "center", marginTop: 8 }}>
            Sign Up
          </Link>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <span className="t-meta">Currency</span>
            <CurrencyToggle />
          </div>
        </div>
      )}
    </header>
  );
}

const navStyles: Record<string, CSSProperties> = {
  bar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, height: "var(--header-h)", background: "var(--nav-bg)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid transparent", transition: "box-shadow 300ms var(--ease), border-color 300ms var(--ease)" },
  inner: { maxWidth: "var(--content-max)", height: "100%", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 },
  logo: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 23, letterSpacing: "-0.01em", color: "var(--fg1)", display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  mark: { width: 34, height: 34, borderRadius: 10, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center" },
  navPill: { display: "flex", gap: 30, padding: "10px 26px", background: "var(--navpill-bg)", border: "1px solid var(--border)", borderRadius: 999 },
  link: { fontSize: 14.5, fontWeight: 500, color: "var(--fg2)", textDecoration: "none" },
  linkActive: { color: "var(--fg1)" },
  right: { display: "flex", alignItems: "center", gap: 14 },
  iconBtn: { width: 40, height: 40, borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", display: "grid", placeItems: "center", cursor: "pointer" },
  favBadge: { position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center", lineHeight: 1 },
  burger: { display: "none", width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", placeItems: "center", cursor: "pointer" },
  mobileMenu: { display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "var(--surface)", borderBottom: "1px solid var(--border)" },
  mLink: { padding: "12px 8px", fontSize: 16, fontWeight: 500, color: "var(--fg1)", textDecoration: "none", borderBottom: "1px solid var(--border)" },
};
