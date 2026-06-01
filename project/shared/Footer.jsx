// EverGreen — charcoal footer
function Footer() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  const socials = [
    { n: "telegram", l: "Telegram" }, { n: "whatsapp", l: "WhatsApp" },
    { n: "instagram", l: "Instagram" }, { n: "youtube", l: "YouTube" },
  ];
  return (
    <footer style={ftStyles.foot}>
      <div style={ftStyles.top}>
        <h2 style={ftStyles.bigHead}>
          Discover Nature's Wonders<br />with <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Expert Guidance</span>
        </h2>
        <div style={ftStyles.contactCol}>
          <div style={ftStyles.cRow}><i data-lucide="map-pin"></i><span>12345, Cedar Hill Road,<br />Aspen, Colorado</span></div>
          <div style={ftStyles.cRow}><i data-lucide="phone"></i><span>(+1) 839-849-8483</span></div>
          <div style={ftStyles.social}>
            {socials.map((s) => (
              <a key={s.n} href="#" aria-label={s.l} style={ftStyles.socialLink}>
                <img src={`https://cdn.simpleicons.org/${s.n}/9A9A98`} width="17" height="17" alt={s.l} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={ftStyles.midline} />
      <div style={ftStyles.navRow}>
        <div style={ftStyles.navGroup}>
          <a href="index.html" style={ftStyles.link}>Home</a>
          <a href="about.html" style={ftStyles.link}>About</a>
          <a href="properties.html" style={ftStyles.link}>Properties</a>
          <a href="contact.html" style={ftStyles.link}>Services</a>
        </div>
        <a href="index.html" style={ftStyles.logo}>EverGreen<span style={ftStyles.dot} /></a>
        <div style={ftStyles.navGroup}>
          <a href="properties.html" style={ftStyles.link}>Gallery</a>
          <a href="index.html" style={ftStyles.link}>FAQ</a>
          <a href="signup.html" style={ftStyles.link}>Pricing</a>
          <a href="contact.html" style={ftStyles.link}>Contact</a>
        </div>
      </div>
      <div style={ftStyles.base}>
        <span>© 2026 EverGreen. All rights reserved.</span>
        <span style={{ display: "flex", gap: 24 }}>
          <a href="#" style={ftStyles.baseLink}>Terms & Conditions</a>
          <a href="#" style={ftStyles.baseLink}>Privacy Policy</a>
        </span>
      </div>
    </footer>
  );
}

const ftStyles = {
  foot: { background: "var(--charcoal)", color: "var(--on-charcoal)", marginTop: 0 },
  top: { maxWidth: "var(--content-max)", margin: "0 auto", padding: "72px 32px 48px", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", alignItems: "flex-start" },
  bigHead: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 },
  contactCol: { display: "flex", flexDirection: "column", gap: 16, fontSize: 14.5, color: "var(--on-charcoal-2)" },
  cRow: { display: "flex", gap: 12, alignItems: "flex-start", lineHeight: 1.5 },
  social: { display: "flex", gap: 12, marginTop: 8 },
  socialLink: { width: 40, height: 40, borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 200ms var(--ease)" },
  midline: { maxWidth: "var(--content-max)", height: 1, margin: "0 auto", background: "rgba(255,255,255,0.1)" },
  navRow: { maxWidth: "var(--content-max)", margin: "0 auto", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" },
  navGroup: { display: "flex", gap: 28, flexWrap: "wrap" },
  logo: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "#fff", display: "flex", alignItems: "baseline", gap: 3, textDecoration: "none" },
  dot: { width: 6, height: 6, borderRadius: 999, background: "var(--accent)", alignSelf: "flex-end", marginBottom: 5 },
  link: { fontSize: 14, color: "var(--on-charcoal-2)", textDecoration: "none", transition: "color 200ms var(--ease)" },
  base: { maxWidth: "var(--content-max)", margin: "0 auto", padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--on-charcoal-2)", flexWrap: "wrap", gap: 12 },
  baseLink: { color: "var(--on-charcoal-2)", textDecoration: "none" },
};

window.Footer = Footer;
