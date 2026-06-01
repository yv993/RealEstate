"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, isFinePointer } from "@/lib/gsap";

/**
 * Optional soft custom cursor: a thin ring (--fg) that trails the pointer with a
 * small dot that tracks it closely. Grows over interactive elements. Active ONLY
 * on fine-pointer devices and when reduced-motion is off; otherwise it's an inert,
 * invisible pair of divs.
 *
 * To remove entirely: delete this file and the <Cursor /> line in app/layout.tsx.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = ring.current;
    const d = dot.current;
    if (!r || !d || prefersReducedMotion() || !isFinePointer()) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([r, d], { autoAlpha: 0 });

    const ringX = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3.out" });
    const ringY = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3.out" });
    const dotX = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([r, d], { autoAlpha: 1, duration: 0.2 });
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const SELECTOR = "a, button, [role='button'], input, textarea, select, label, .spotlight-card";
    const over = (e: Event) => {
      if ((e.target as Element)?.closest?.(SELECTOR)) gsap.to(r, { scale: 1.9, duration: 0.25, ease: "power3.out" });
    };
    const out = (e: Event) => {
      if ((e.target as Element)?.closest?.(SELECTOR)) gsap.to(r, { scale: 1, duration: 0.25, ease: "power3.out" });
    };
    const leave = () => gsap.to([r, d], { autoAlpha: 0, duration: 0.2 });
    const enter = () => {
      shown = true;
      gsap.to([r, d], { autoAlpha: 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="evg-cursor-ring" aria-hidden />
      <div ref={dot} className="evg-cursor-dot" aria-hidden />
    </>
  );
}
