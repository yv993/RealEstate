"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "evergreen:favorites";

type FavoritesCtx = {
  ids: number[];
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  count: number;
  /** true once the client has hydrated localStorage — guards SSR mismatch */
  ready: boolean;
};

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
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

  const toggle = useCallback(
    (id: number) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    []
  );
  const isFavorite = useCallback((id: number) => ids.includes(id), [ids]);

  return (
    <Ctx.Provider value={{ ids, isFavorite, toggle, count: ids.length, ready }}>{children}</Ctx.Provider>
  );
}

export function useFavorites(): FavoritesCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { ids: [], isFavorite: () => false, toggle: () => {}, count: 0, ready: false };
  return ctx;
}
