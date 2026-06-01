"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "evergreen:compare";
export const COMPARE_MAX = 3;

type CompareCtx = {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  ready: boolean;
  full: boolean;
};

const Ctx = createContext<CompareCtx | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, ready]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_MAX) return prev; // ignore beyond the max
      return [...prev, id];
    });
  }, []);
  const remove = useCallback((id: number) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id: number) => ids.includes(id), [ids]);

  return (
    <Ctx.Provider value={{ ids, has, toggle, remove, clear, count: ids.length, ready, full: ids.length >= COMPARE_MAX }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCompare(): CompareCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { ids: [], has: () => false, toggle: () => {}, remove: () => {}, clear: () => {}, count: 0, ready: false, full: false };
  return ctx;
}
