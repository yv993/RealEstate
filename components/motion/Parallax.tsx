"use client";

import { useRef, ReactNode, CSSProperties } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** total vertical travel in px across the scroll range */
  amount?: number;
};

/**
 * Wraps an element and moves it vertically as the user scrolls through it,
 * creating a subtle depth/parallax effect. Used for hero backgrounds.
 */
export function Parallax({ children, className, style, amount = 120 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -amount / 20 },
        {
          yPercent: amount / 20,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
