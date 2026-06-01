"use client";

import { useRef, ReactNode, CSSProperties, ElementType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type RevealStaggerProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
};

/**
 * Animate the direct children of this container in sequence (staggered) as the
 * container scrolls into view. Great for card grids and lists.
 */
export function RevealStagger({
  children,
  as: Tag = "div",
  className,
  style,
  y = 28,
  stagger = 0.12,
  duration = 0.7,
  start = "top 82%",
}: RevealStaggerProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = el.children;
    if (prefersReducedMotion()) {
      gsap.set(kids, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        kids,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Comp = Tag as ElementType;
  return (
    <Comp ref={ref} className={className} style={style}>
      {children}
    </Comp>
  );
}
