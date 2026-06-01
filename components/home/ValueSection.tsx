import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ArrowUpRight } from "lucide-react";
import { IMG } from "@/lib/data";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { Reveal } from "../motion/Reveal";
import { PointerParallax } from "../motion/PointerParallax";
import { BLUR_DATA_URL } from "@/lib/image";

export function ValueSection() {
  return (
    <section className="section wrap">
      <div style={valStyles.headRow}>
        <Reveal as="h2" className="h-section" style={{ fontSize: 34, maxWidth: 520 }} x={-28}>
          The right home in Armenia is closer than you think.
        </Reveal>
        <Reveal delay={0.1} style={valStyles.headRight} x={28}>
          <span style={valStyles.playBtn}>
            <Play size={18} />
          </span>
          <p className="t-meta" style={{ margin: 0, maxWidth: 240 }}>
            Each listing offers unique features, exceptional quality, and prime locations.
          </p>
        </Reveal>
      </div>

      <div className="val-grid" style={valStyles.grid}>
        <Reveal className="val-big" style={valStyles.bigImgWrap} x={-26}>
          <PointerParallax strength={8} scale={1.06} style={{ position: "absolute", inset: 0 }}>
            <Image src={sceneUrl("villa", 1000)} alt={SCENES.villa.alt} fill sizes="(max-width: 1023px) 100vw, 40vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={valStyles.bigImg} />
          </PointerParallax>
          <div style={valStyles.avatarRow}>
            {["1500648767791-00dcc994a43e", "1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d"].map((id, i) => (
              <Image key={id} src={IMG(id, 120)} alt="" width={30} height={30} style={{ ...valStyles.avatar, marginLeft: i ? -12 : 0 }} />
            ))}
            <span style={valStyles.avatarTxt}>Trusted by families</span>
          </div>
        </Reveal>

        <Reveal delay={0.1} style={valStyles.smallCard}>
          <h3 style={valStyles.smallHead}>Big things can happen in small spaces.</h3>
          <p className="t-meta" style={{ margin: 0 }}>
            With thoughtful design and smart organization, you can maximize every inch — making room for creativity.
          </p>
          <Link href="/properties" className="btn btn-outline btn-pill" style={{ marginTop: 18, alignSelf: "flex-start" }}>
            Details
          </Link>
        </Reveal>

        <Reveal delay={0.2} style={valStyles.priceCard} x={26}>
          <div style={{ position: "relative", width: "100%", height: 150 }}>
            <Image src={IMG("1512917774080-9991f1c4c750", 700)} alt="Property" fill sizes="(max-width: 1023px) 100vw, 25vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={{ objectFit: "cover" }} />
          </div>
          <div style={{ padding: "16px 18px 18px" }}>
            <span className="t-label" style={{ color: "var(--fg2)" }}>Pricing starts at</span>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "2px 0 14px" }}>$256K</div>
            <Link href="/properties" className="btn btn-primary btn-pill">
              Explore Properties
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const valStyles: Record<string, CSSProperties> = {
  headRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 30, marginBottom: 34, flexWrap: "wrap" },
  headRight: { display: "flex", alignItems: "center", gap: 14 },
  playBtn: { width: 48, height: 48, borderRadius: 999, background: "var(--charcoal)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 },
  grid: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 20, alignItems: "stretch" },
  bigImgWrap: { position: "relative", borderRadius: "var(--radius-card)", overflow: "hidden", minHeight: 340 },
  bigImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  avatarRow: { position: "absolute", left: 16, bottom: 16, display: "flex", alignItems: "center", gap: 0, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "6px 14px 6px 6px", backdropFilter: "blur(6px)" },
  avatar: { width: 30, height: 30, borderRadius: 999, border: "2px solid #fff", objectFit: "cover" },
  avatarTxt: { fontSize: 12.5, fontWeight: 600, color: "var(--fg1)", marginLeft: 10 },
  smallCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: 22, display: "flex", flexDirection: "column" },
  smallHead: { fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 12px", fontFamily: "var(--font-display)" },
  priceCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", display: "flex", flexDirection: "column" },
  priceImg: { width: "100%", height: 150, objectFit: "cover" },
};
