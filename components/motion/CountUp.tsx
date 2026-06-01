"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsoLayoutEffect";

type CountUpProps = { end: number; suffix?: string; duration?: number };

/** Number that counts up from 0 when it scrolls into view (GSAP-driven). */
export function CountUp({ end, suffix = "", duration = 1.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = end.toLocaleString("en-US") + suffix;
      return;
    }
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: end,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toLocaleString("en-US") + suffix;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [end, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}
