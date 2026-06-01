"use client";

import { useRef, ReactNode, CSSProperties } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type TiltProps = {
  children: ReactNode;
  /** max tilt in degrees */
  max?: number;
  /** scale applied while hovered */
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Wraps a card and applies a subtle 3D tilt toward the cursor plus a soft scale,
 * easing back on leave. GPU-friendly (rotate/scale only). Disabled for
 * reduced-motion and on touch/coarse-pointer devices.
 */
export function Tilt({ children, max = 6, scale = 1.02, className, style }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isFinePointer()) return;

    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3.out" });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
      scaleTo(scale);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
      scaleTo(1);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max, scale]);

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}
