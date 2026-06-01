"use client";

import { useEffect, useState, CSSProperties } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const el = document.documentElement;
    el.classList.add("theme-transition");
    const next = !el.classList.contains("dark");
    el.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
    window.setTimeout(() => el.classList.remove("theme-transition"), 480);
  };

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" style={btnStyle} suppressHydrationWarning>
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted && dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

const btnStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 999,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--fg1)",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};
