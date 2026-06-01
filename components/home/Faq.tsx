"use client";

import { useRef, useState, CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { FAQS, IMG } from "@/lib/data";
import { BLUR_DATA_URL } from "@/lib/image";
import { Reveal } from "../motion/Reveal";

function FaqItem({
  item,
  open,
  onToggle,
  withImg,
}: {
  item: { q: string; a: string };
  open: boolean;
  onToggle: () => void;
  withImg?: boolean;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  return (
    <div style={{ ...faqStyles.item, ...(open ? faqStyles.itemOpen : {}) }}>
      <button style={faqStyles.q} onClick={onToggle}>
        <span style={{ fontWeight: open ? 600 : 500, fontSize: 16 }}>{item.q}</span>
        <span style={{ ...faqStyles.chev, transform: open ? "rotate(180deg)" : "none" }}>
          <ChevronDown size={18} />
        </span>
      </button>
      <div
        ref={bodyRef}
        style={{
          ...faqStyles.bodyWrap,
          maxHeight: open ? (bodyRef.current ? bodyRef.current.scrollHeight + 40 : 320) : 0,
        }}
      >
        <div style={faqStyles.bodyInner}>
          <p className="t-meta" style={{ margin: 0, flex: 1, lineHeight: 1.65 }}>
            {item.a}
          </p>
          {withImg && (
            <Image src={IMG("1618220179428-22790b461013", 360)} alt="" width={150} height={96} placeholder="blur" blurDataURL={BLUR_DATA_URL} style={faqStyles.bodyImg} />
          )}
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section wrap">
      <div className="faq-layout" style={faqStyles.layout}>
        <Reveal className="faq-left" style={faqStyles.left} x={-24}>
          <p className="eyebrow">FAQ</p>
          <h2 className="h-section" style={{ fontSize: 34 }}>
            Frequently asked questions
          </h2>
          <p className="lead" style={{ marginTop: 14 }}>
            Our experts guide you in making informed investment decisions based on market insight —
            residential, commercial, and luxury properties tailored to your goals and budget.
          </p>
          <Link href="/contact" className="btn btn-outline btn-pill" style={{ marginTop: 22 }}>
            Ask a question
          </Link>
        </Reveal>
        <Reveal delay={0.1} style={faqStyles.list}>
          {FAQS.map((f, i) => (
            <FaqItem
              key={i}
              item={f}
              open={open === i}
              withImg={i === 0}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

const faqStyles: Record<string, CSSProperties> = {
  layout: { display: "grid", gridTemplateColumns: "0.85fr 1.4fr", gap: 48, alignItems: "start" },
  left: { position: "sticky", top: 100 },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  item: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", transition: "border-color 200ms var(--ease), box-shadow 200ms var(--ease)" },
  itemOpen: { border: "1px solid var(--accent)", boxShadow: "var(--shadow-md)" },
  q: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", background: "transparent", border: 0, cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", color: "var(--fg1)" },
  chev: { display: "grid", placeItems: "center", color: "var(--accent)", transition: "transform 300ms var(--ease)", flexShrink: 0 },
  bodyWrap: { maxHeight: 0, overflow: "hidden", transition: "max-height 360ms var(--ease)" },
  bodyInner: { display: "flex", gap: 20, padding: "0 22px 22px", alignItems: "flex-start" },
  bodyImg: { width: 150, height: 96, objectFit: "cover", borderRadius: 12, flexShrink: 0 },
};
