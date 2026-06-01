"use client";

import { useRef, ReactNode, CSSProperties, PointerEvent } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Card wrapper that shows a soft radial glow (the brand --accent at low opacity)
 * following the cursor. Pure CSS variables + a glow layer; the hover reveal is
 * scoped to fine-pointer devices in globals.css, and respects reduced-motion.
 */
export function SpotlightCard({ children, className, style }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`spotlight-card${className ? " " + className : ""}`}
      style={style}
    >
      {children}
      <span className="spotlight-glow" aria-hidden />
    </div>
  );
}
