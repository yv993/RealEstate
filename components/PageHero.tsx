"use client";

import { useRef, CSSProperties } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./motion/useIsoLayoutEffect";
import { Parallax } from "./motion/Parallax";
import { BLUR_DATA_URL } from "@/lib/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  sub?: string;
  img: string;
};

export function PageHero({ eyebrow, title, sub, img }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".ph-anim", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={phStyles.wrap}>
      <Parallax className="ph-bg" style={phStyles.bgWrap} amount={140}>
        <Image src={img} alt="" fill priority sizes="100vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={phStyles.bg} />
      </Parallax>
      <div style={phStyles.scrim} />
      <div className="wrap" style={phStyles.content}>
        <p className="eyebrow ph-anim" style={{ color: "#fff" }}>
          {eyebrow}
        </p>
        <h1 className="h-hero ph-anim" style={phStyles.title}>
          {title}
        </h1>
        {sub && (
          <p className="ph-anim" style={phStyles.sub}>
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}

const phStyles: Record<string, CSSProperties> = {
  wrap: { position: "relative", overflow: "hidden", paddingTop: 150, paddingBottom: 70 },
  bgWrap: { position: "absolute", inset: "-10% 0", zIndex: 0 },
  bg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "kenburns 20s var(--ease) infinite alternate" },
  scrim: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,18,14,0.62), rgba(15,18,14,0.74))" },
  content: { position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  title: { color: "#fff", fontSize: "clamp(38px, 5vw, 56px)" },
  sub: { color: "rgba(255,255,255,0.85)", fontSize: 17, marginTop: 16, maxWidth: 560 },
};
