import { CSSProperties } from "react";
import Image from "next/image";
import { Check, Gem, Compass, Handshake } from "lucide-react";
import { IMG, STATS } from "@/lib/data";
import { BLUR_DATA_URL } from "@/lib/image";
import { Reveal } from "../motion/Reveal";
import { RevealStagger } from "../motion/RevealStagger";
import { CountUp } from "../motion/CountUp";

export function AboutStory() {
  return (
    <section className="section wrap">
      <div className="about-story" style={abStyles.story}>
        <Reveal style={abStyles.storyImgs} x={-30}>
          <div style={abStyles.imgA}>
            <Image src={IMG("1600585154340-be6161a56a0c", 800)} alt="" fill sizes="(max-width: 1023px) 100vw, 45vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={{ objectFit: "cover" }} />
          </div>
          <div style={abStyles.imgB}>
            <Image src={IMG("1600607687939-ce8a6c25118c", 700)} alt="" fill sizes="(max-width: 1023px) 60vw, 25vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={{ objectFit: "cover" }} />
          </div>
          <div style={abStyles.expBadge}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600 }}>12+</span>
            <span className="t-meta" style={{ lineHeight: 1.3 }}>
              years of
              <br />
              quiet expertise
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1} style={abStyles.storyText} x={30}>
          <p className="eyebrow">Who we are</p>
          <h2 className="h-section" style={{ fontSize: 36 }}>
            A boutique agency built on trust, not noise.
          </h2>
          <p className="lead" style={{ marginTop: 18 }}>
            EverGreen began in Yerevan with a simple belief: finding a home in Armenia should feel
            calm, considered, and personal. We curate a small, exceptional collection of properties
            — across the city and the regions — and guide every client through it with patience.
          </p>
          <p className="lead" style={{ marginTop: 14 }}>
            No pressure, no clutter. Just thoughtful design, prime locations, and people who
            genuinely care about where you&apos;ll live next.
          </p>
          <div style={abStyles.checks}>
            {["Hand-picked listings", "Trusted lending partners", "End-to-end concierge", "Private viewings"].map((c) => (
              <div key={c} style={abStyles.check}>
                <span style={abStyles.checkIcon}>
                  <Check size={14} />
                </span>
                {c}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Values() {
  const items = [
    { Icon: Gem, h: "Quiet luxury", t: "We let the architecture and light speak. Every listing is chosen for quality, not volume." },
    { Icon: Compass, h: "Honest guidance", t: "Market insight and comparable data, presented plainly — so you decide with confidence." },
    { Icon: Handshake, h: "Personal care", t: "One dedicated advisor from first viewing to final signature. You're never a transaction." },
  ];
  return (
    <section style={{ background: "var(--band)" }}>
      <div className="section wrap">
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 48px" }}>
          <Reveal as="p" className="eyebrow" style={{ justifyContent: "center" }}>
            Our principles
          </Reveal>
          <Reveal as="h2" className="h-section" style={{ fontSize: 34 }} delay={0.05}>
            What guides every decision we make
          </Reveal>
        </div>
        <RevealStagger className="values-grid" style={abStyles.valGrid} stagger={0.12} y={30}>
          {items.map((it) => (
            <div key={it.h} style={abStyles.valCard}>
              <span style={abStyles.valIcon}>
                <it.Icon size={22} />
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 10px", fontFamily: "var(--font-display)" }}>{it.h}</h3>
              <p className="t-meta" style={{ margin: 0, lineHeight: 1.6 }}>
                {it.t}
              </p>
            </div>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

export function AboutStats() {
  return (
    <section style={abStyles.statBand}>
      <RevealStagger className="wrap stat-row" style={abStyles.statRow} y={20} stagger={0.1}>
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="stat-cell"
            style={{ ...abStyles.statCell, borderLeft: i ? "1px solid rgba(255,255,255,0.14)" : "none" }}
          >
            <div style={abStyles.statNum}>
              <CountUp end={s.value} suffix={s.suffix} />
            </div>
            <div style={{ color: "var(--on-charcoal-2)", fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </RevealStagger>
    </section>
  );
}

export function Team() {
  const team = [
    { n: "Narek Avetisyan", r: "Founder & Principal", img: IMG("1507003211169-0a1dd7228f2d", 500) },
    { n: "Mariam Grigoryan", r: "Head of Curation", img: IMG("1494790108377-be9c29b29330", 500) },
    { n: "Tigran Sahakyan", r: "Lead Advisor", img: IMG("1500648767791-00dcc994a43e", 500) },
    { n: "Lilit Hovhannisyan", r: "Client Concierge", img: IMG("1438761681033-6461ffad8d80", 500) },
  ];
  return (
    <section className="section wrap">
      <div style={{ maxWidth: 600, marginBottom: 44 }}>
        <Reveal as="p" className="eyebrow">
          The people
        </Reveal>
        <Reveal as="h2" className="h-section" style={{ fontSize: 34 }} delay={0.05}>
          A small team, entirely on your side
        </Reveal>
      </div>
      <RevealStagger className="team-grid" style={abStyles.teamGrid} stagger={0.1} y={28}>
        {team.map((m) => (
          <div key={m.n} className="team-card" style={abStyles.teamCard}>
            <div style={abStyles.teamImgWrap}>
              <Image src={m.img} alt={m.n} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} className="team-img" style={abStyles.teamImg} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 16 }}>{m.n}</div>
            <div className="t-meta">{m.r}</div>
          </div>
        ))}
      </RevealStagger>
    </section>
  );
}

const abStyles: Record<string, CSSProperties> = {
  story: { display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "center" },
  storyImgs: { position: "relative", minHeight: 460 },
  imgA: { position: "relative", width: "78%", height: 360, overflow: "hidden", borderRadius: "var(--radius-card)", boxShadow: "var(--shadow-md)" },
  imgB: { position: "absolute", right: 0, bottom: 0, width: "52%", height: 240, overflow: "hidden", borderRadius: "var(--radius-card)", border: "5px solid var(--bg)", boxShadow: "var(--shadow-lg)" },
  expBadge: { position: "absolute", left: 0, bottom: 24, display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", borderRadius: 14, padding: "14px 18px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)" },
  storyText: {},
  checks: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 26 },
  check: { display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 },
  checkIcon: { width: 24, height: 24, borderRadius: 999, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 },
  valGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 },
  valCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 30, boxShadow: "var(--shadow-sm)" },
  valIcon: { width: 52, height: 52, borderRadius: 14, background: "var(--accent-tint)", color: "var(--accent)", display: "grid", placeItems: "center", marginBottom: 18 },
  statBand: { background: "var(--charcoal)", padding: "56px 0" },
  statRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)" },
  statCell: { textAlign: "center", padding: "8px 16px" },
  statNum: { fontFamily: "var(--font-display)", fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff", marginBottom: 4 },
  teamGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 },
  teamCard: {},
  teamImgWrap: { position: "relative", aspectRatio: "3/4", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--border)" },
  teamImg: { objectFit: "cover", transition: "transform 500ms var(--ease)" },
};
