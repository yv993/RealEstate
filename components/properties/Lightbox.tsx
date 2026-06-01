"use client";

import { useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

type LightboxProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  title?: string;
};

export function Lightbox({ images, index, onClose, onIndex, title }: LightboxProps) {
  const startX = useRef(0);
  const prev = () => onIndex((index - 1 + images.length) % images.length);
  const next = () => onIndex((index + 1) % images.length);

  // Keyboard nav + lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title ? `${title} gallery` : "Image gallery"} style={s.overlay} onClick={onClose}>
      <button style={{ ...s.icon, ...s.close }} onClick={onClose} aria-label="Close gallery">
        <X size={22} />
      </button>
      {images.length > 1 && (
        <button style={{ ...s.icon, ...s.left }} onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image">
          <ArrowLeft size={22} />
        </button>
      )}
      <div
        style={s.stage}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
        }}
      >
        <Image src={images[index]} alt={title ?? ""} fill sizes="100vw" style={{ objectFit: "contain" }} priority />
      </div>
      {images.length > 1 && (
        <button style={{ ...s.icon, ...s.right }} onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image">
          <ArrowRight size={22} />
        </button>
      )}
      <div style={s.counter}>
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  overlay: { position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,12,10,0.92)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center" },
  stage: { position: "relative", width: "min(92vw, 1200px)", height: "min(82vh, 800px)" },
  icon: { position: "absolute", width: 48, height: 48, borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(6px)" },
  close: { top: 24, right: 24 },
  left: { left: 24, top: "50%", transform: "translateY(-50%)" },
  right: { right: 24, top: "50%", transform: "translateY(-50%)" },
  counter: { position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 },
};
