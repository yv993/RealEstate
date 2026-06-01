// EverGreen — sticky site header
function Nav({ active }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h(); window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const nav = [
    { label: "Home", href: "index.html" },
    { label: "About Us", href: "about.html" },
    { label: "Property List", href: "properties.html" },
    { label: "Contact Us", href: "contact.html" },
  ];

  return (
    <header style={{ ...navStyles.bar, boxShadow: scrolled ? "var(--shadow-sm)" : "none", borderBottomColor: scrolled ? "var(--border)" : "transparent" }}>
      <div style={navStyles.inner}>
        <a href="index.html" style={navStyles.logo}>
          <span style={navStyles.mark}><i data-lucide="trees"></i></span>
          EverGreen
        </a>
        <nav className="evg-navpill" style={navStyles.navPill}>
          {nav.map((n) => (
            <a key={n.label} href={n.href}
               className={"navlink" + (active === n.label ? " active" : "")}
               style={{ ...navStyles.link, ...(active === n.label ? navStyles.linkActive : {}) }}>
              {n.label}
            </a>
          ))}
        </nav>
        <div style={navStyles.right}>
          <a href="properties.html" aria-label="Search" style={navStyles.iconBtn}><i data-lucide="search"></i></a>
          <a href="signup.html" className="btn btn-primary btn-pill" style={{ textDecoration: "none" }}>Sign Up</a>
          <button className="evg-burger" style={navStyles.burger} onClick={() => setOpen(!open)} aria-label="Menu"><i data-lucide={open ? "x" : "menu"}></i></button>
        </div>
      </div>
      {open && (
        <div style={navStyles.mobileMenu}>
          {nav.map((n) => (
            <a key={n.label} href={n.href} style={{ ...navStyles.mLink, ...(active === n.label ? { color: "var(--accent)" } : {}) }}>{n.label}</a>
          ))}
          <a href="signup.html" className="btn btn-primary" style={{ justifyContent: "center", marginTop: 8 }}>Sign Up</a>
        </div>
      )}
    </header>
  );
}

const navStyles = {
  bar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, height: "var(--header-h)", background: "rgba(255,255,255,0.82)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid transparent", transition: "box-shadow 300ms var(--ease), border-color 300ms var(--ease)" },
  inner: { maxWidth: "var(--content-max)", height: "100%", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 },
  logo: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 23, letterSpacing: "-0.01em", color: "var(--fg1)", display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  mark: { width: 34, height: 34, borderRadius: 10, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center" },
  navPill: { display: "flex", gap: 30, padding: "10px 26px", background: "rgba(250,250,248,0.7)", border: "1px solid var(--border)", borderRadius: 999 },
  link: { fontSize: 14.5, fontWeight: 500, color: "var(--fg2)", textDecoration: "none" },
  linkActive: { color: "var(--fg1)" },
  right: { display: "flex", alignItems: "center", gap: 14 },
  iconBtn: { width: 40, height: 40, borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", display: "grid", placeItems: "center", cursor: "pointer" },
  burger: { display: "none", width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", placeItems: "center", cursor: "pointer" },
  mobileMenu: { display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "var(--surface)", borderBottom: "1px solid var(--border)" },
  mLink: { padding: "12px 8px", fontSize: 16, fontWeight: 500, color: "var(--fg1)", textDecoration: "none", borderBottom: "1px solid var(--border)" },
};

// mobile rules injected once
(function () {
  if (document.getElementById("nav-resp")) return;
  const s = document.createElement("style"); s.id = "nav-resp";
  s.textContent = "@media (max-width: 900px){.evg-navpill{display:none!important}.evg-burger{display:grid!important}}";
  document.head.appendChild(s);
})();

window.Nav = Nav;
