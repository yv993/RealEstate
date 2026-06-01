"use client";

import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

/**
 * Renders its children only once they scroll near the viewport. Used to defer
 * heavy below-the-fold widgets (like the Leaflet map) so their JS isn't fetched
 * until needed. Falls back to rendering immediately without IntersectionObserver.
 */
export function LazyOnVisible({
  children,
  rootMargin = "250px",
  minHeight,
  style,
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number | string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShow(true);
            io.disconnect();
          }
        });
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: show ? undefined : minHeight, ...style }}>
      {show ? children : null}
    </div>
  );
}
