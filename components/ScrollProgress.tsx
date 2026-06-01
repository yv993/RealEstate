"use client";

import { useEffect, useRef, CSSProperties } from "react";

// Subtle bronze bar at the very top showing reading progress down the page.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      el.style.width = max > 0 ? `${(h.scrollTop / max) * 100}%` : "0%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} aria-hidden style={bar} />;
}

const bar: CSSProperties = { position: "fixed", top: 0, left: 0, height: 3, width: "0%", background: "var(--accent)", zIndex: 100, pointerEvents: "none", transition: "width 80ms linear" };
