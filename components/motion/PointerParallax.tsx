"use client";

import { useRef, ReactNode, CSSProperties } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type PointerParallaxProps = {
  children: ReactNode;
  /** max drift in px as the cursor moves across the viewport; negative inverts direction */
  strength?: number;
  /** base scale to mask edge reveal on full-bleed images */
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Drifts its child a few px following the cursor (damped), for depth. Composes
 * with scroll parallax since it only touches x/y/scale. Disabled for
 * reduced-motion and on touch/coarse-pointer devices.
 */
export function PointerParallax({ children, strength = 12, scale = 1, className, style }: PointerParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isFinePointer()) return;

    if (scale !== 1) gsap.set(el, { scale });
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      xTo(nx * strength);
      yTo(ny * strength);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [strength, scale]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform", ...style }}>
      {children}
    </div>
  );
}
