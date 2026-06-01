import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";

const SOCIALS = [
  { n: "telegram", l: "Telegram", href: "https://t.me/EverGreenArmenia" },
  { n: "whatsapp", l: "WhatsApp", href: "https://wa.me/37410539853" },
  { n: "instagram", l: "Instagram", href: "https://instagram.com/evergreen.am" },
  { n: "youtube", l: "YouTube", href: "https://youtube.com/@evergreenarmenia" },
];

export function Footer() {
  return (
    <footer style={ftStyles.foot}>
      <div style={ftStyles.top}>
        <h2 style={ftStyles.bigHead}>
          Discover Nature&apos;s Wonders
          <br />
          with <span style={{ fontStyle: "italic", color: "var(--accent)" }}>Expert Guidance</span>
        </h2>
        <div style={ftStyles.contactCol}>
          <div style={ftStyles.cRow}>
            <MapPin size={18} />
            <span>
              12 Northern Avenue,
              <br />
              Yerevan 0001, Armenia
            </span>
          </div>
          <div style={ftStyles.cRow}>
            <Phone size={18} />
            <span>(+374) 10 539 853</span>
          </div>
          <div style={ftStyles.social}>
            {SOCIALS.map((s) => (
              <a key={s.n} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`EverGreen on ${s.l}`} style={ftStyles.socialLink}>
                <Image src={`https://cdn.simpleicons.org/${s.n}/9A9A98`} width={17} height={17} alt="" unoptimized />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={ftStyles.midline} />
      <div style={ftStyles.navRow}>
        <div style={ftStyles.navGroup}>
          <Link href="/" style={ftStyles.link}>Home</Link>
          <Link href="/about" style={ftStyles.link}>About</Link>
          <Link href="/properties" style={ftStyles.link}>Properties</Link>
          <Link href="/rent" style={ftStyles.link}>For Rent</Link>
        </div>
        <Link href="/" style={ftStyles.logo}>
          EverGreen<span style={ftStyles.dot} />
        </Link>
        <div style={ftStyles.navGroup}>
          <Link href="/locations" style={ftStyles.link}>Neighbourhoods</Link>
          <Link href="/agents" style={ftStyles.link}>Our Team</Link>
          <Link href="/insights" style={ftStyles.link}>Insights</Link>
          <Link href="/contact" style={ftStyles.link}>Contact</Link>
        </div>
      </div>
      <div style={ftStyles.base}>
        <span>© 2026 EverGreen. All rights reserved.</span>
        <span style={{ display: "flex", gap: 24 }}>
          <Link href="/terms" style={ftStyles.baseLink}>Terms &amp; Conditions</Link>
          <Link href="/privacy" style={ftStyles.baseLink}>Privacy Policy</Link>
        </span>
      </div>
    </footer>
  );
}

const ftStyles: Record<string, CSSProperties> = {
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
