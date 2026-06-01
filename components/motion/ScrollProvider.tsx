"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps ScrollTrigger positions accurate: recalculates after images/fonts load
 * and after every client-side route change.
 */
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    // After fonts/images settle, recompute trigger positions.
    const t = window.setTimeout(refresh, 200);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return <>{children}</>;
}
