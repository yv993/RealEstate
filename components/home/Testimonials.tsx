"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import { BLUR_DATA_URL } from "@/lib/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "../motion/Reveal";

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const n = TESTIMONIALS.length;
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const paused = useRef(false);
  const dir = useRef(1);

  const goTo = (next: number) => {
    dir.current = next > idx || (idx === n - 1 && next === 0) ? 1 : -1;
    setIdx((next + n) % n);
  };

  // Auto-advance, paused while the pointer is over the card.
  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) {
        dir.current = 1;
        setIdx((i) => (i + 1) % n);
      }
    }, 6000);
    return () => clearInterval(t);
  }, [n]);

  // Slide + fade the quote and photo whenever the active testimonial changes.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (quoteRef.current) {
      gsap.fromTo(quoteRef.current, { opacity: 0, x: dir.current * 48 }, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" });
    }
    if (photoRef.current) {
      gsap.fromTo(photoRef.current, { opacity: 0.3, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" });
    }
  }, [idx]);

  const t = TESTIMONIALS[idx];

  return (
    <section style={tsStyles.band}>
      <div className="wrap">
        <div style={tsStyles.head}>
          <div>
            <Reveal as="p" className="eyebrow">
              Testimonials
            </Reveal>
            <Reveal as="h2" className="h-section" style={{ fontSize: 34 }} delay={0.05}>
              What our clients say about us
            </Reveal>
          </div>
          <Reveal delay={0.1} style={tsStyles.reviewMeta}>
            <div style={tsStyles.avatars}>
              {TESTIMONIALS.map((x, i) => (
                <Image key={i} src={x.img} alt="" width={34} height={34} style={{ ...tsStyles.av, marginLeft: i ? -10 : 0 }} />
              ))}
            </div>
            <div>
              <strong>More than 500+</strong>
              <br />
              <span className="t-meta">Client reviews</span>
            </div>
          </Reveal>
        </div>

        <Reveal className="ts-card" style={tsStyles.card}>
          <div className="ts-photo" style={tsStyles.photoWrap}>
            <Image ref={photoRef} src={t.img} alt={t.name} fill sizes="(max-width: 1023px) 100vw, 40vw" placeholder="blur" blurDataURL={BLUR_DATA_URL} style={{ objectFit: "cover" }} />
          </div>
          <div
            style={tsStyles.qcol}
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
          >
            <span style={tsStyles.quoteMark}>&ldquo;</span>
            <p ref={quoteRef} style={tsStyles.quote}>
              {t.quote}
            </p>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{t.name}</div>
              <div className="t-meta">{t.role}</div>
            </div>
            <div style={tsStyles.controls}>
              <div style={tsStyles.dots}>
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{ ...tsStyles.dot, ...(i === idx ? tsStyles.dotOn : {}) }}
                    aria-label={"Review " + (i + 1)}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={tsStyles.arrow} onClick={() => goTo((idx - 1 + n) % n)} aria-label="Previous">
                  <ArrowLeft size={18} />
                </button>
                <button style={tsStyles.arrow} onClick={() => goTo((idx + 1) % n)} aria-label="Next">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const tsStyles: Record<string, CSSProperties> = {
  band: { background: "var(--bg)", padding: "64px 0" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 36, flexWrap: "wrap" },
  reviewMeta: { display: "flex", alignItems: "center", gap: 14, fontSize: 14 },
  avatars: { display: "flex" },
  av: { width: 34, height: 34, borderRadius: 999, border: "2px solid var(--bg)", objectFit: "cover" },
  card: { display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "var(--shadow-md)" },
  photoWrap: { position: "relative", width: "100%", height: "100%", minHeight: 320 },
  qcol: { padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" },
  quoteMark: { fontFamily: "var(--font-display)", fontSize: 80, lineHeight: 0.6, color: "var(--accent)", opacity: 0.4, display: "block", height: 34 },
  quote: { fontFamily: "var(--font-display)", fontSize: 23, lineHeight: 1.5, color: "var(--fg1)", margin: "0 0 18px" },
  controls: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 },
  dots: { display: "flex", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, border: 0, background: "var(--border)", cursor: "pointer", padding: 0, transition: "all 250ms var(--ease)" },
  dotOn: { width: 24, background: "var(--accent)" },
  arrow: { width: 42, height: 42, borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg1)", display: "grid", placeItems: "center", cursor: "pointer", transition: "all 200ms var(--ease)" },
};
