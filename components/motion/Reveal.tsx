"use client";

import { useRef, ReactNode, CSSProperties, ElementType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** vertical offset to slide up from */
  y?: number;
  /** horizontal offset to slide in from */
  x?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  /** ScrollTrigger start position */
  start?: string;
};

/**
 * Fade + slide a single element in as it scrolls into view (GSAP ScrollTrigger).
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  style,
  y = 26,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 0.8,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, x, scale },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Comp = Tag as ElementType;
  return (
    <Comp ref={ref} className={`gsap-reveal${className ? " " + className : ""}`} style={style}>
      {children}
    </Comp>
  );
}
