"use client";

import { useRef, ReactNode, CSSProperties } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type MagneticProps = {
  children: ReactNode;
  /** max travel toward the cursor, in px */
  strength?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Wraps a button/link and gently pulls it toward the cursor, springing back on
 * leave. Disabled for reduced-motion and on touch/coarse-pointer devices.
 */
export function Magnetic({ children, strength = 8, className, style }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isFinePointer()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      const clamp = (v: number) => Math.max(-strength, Math.min(strength, v * 0.35));
      xTo(clamp(relX));
      yTo(clamp(relY));
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex", willChange: "transform", ...style }}>
      {children}
    </span>
  );
}
