import { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SCENES, sceneUrl } from "@/lib/scenes";
import { BLUR_DATA_URL } from "@/lib/image";
import { Reveal } from "../motion/Reveal";
import { Parallax } from "../motion/Parallax";
import { Magnetic } from "../motion/Magnetic";

export function CtaBanner() {
  return (
    <section style={ctaStyles.wrap}>
      <Parallax style={{ position: "absolute", inset: "-12% 0", zIndex: 0 }} amount={120}>
        <Image src={sceneUrl("mountains", 1800)} alt={SCENES.mountains.alt} fill sizes="100vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={ctaStyles.bg} />
      </Parallax>
      <div style={ctaStyles.scrim} />
      <div className="wrap" style={ctaStyles.content}>
        <Reveal as="h2" style={ctaStyles.head}>
          Ready to Make Your Dream Property a Reality?
        </Reveal>
        <Reveal as="p" style={ctaStyles.sub} delay={0.1}>
          Explore a curated selection of homes across Armenia — to buy or rent — that align with
          your vision and goals.
        </Reveal>
        <Reveal delay={0.2}>
          <Magnetic strength={10}>
            <Link href="/signup" className="btn btn-primary btn-pill btn-lg">
              Get Started
              <ArrowUpRight size={16} />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

const ctaStyles: Record<string, CSSProperties> = {
  wrap: { position: "relative", overflow: "hidden", padding: "96px 0" },
  bg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "kenburns 20s var(--ease) infinite alternate" },
  scrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,18,14,0.55), rgba(15,18,14,0.72))" },
  content: { position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  head: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(30px, 4.4vw, 50px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: 720, margin: 0 },
  sub: { color: "rgba(255,255,255,0.85)", fontSize: 17, marginTop: 16, maxWidth: 520 },
};
