"use client";

import { useEffect, useState } from "react";

const KEY = "evergreen:recent";
const MAX = 8;

/** Records a viewed property id (most-recent first, de-duped, capped). */
export function recordRecent(id: number) {
  try {
    const raw = localStorage.getItem(KEY);
    const list: number[] = raw ? JSON.parse(raw) : [];
    const next = [id, ...list.filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

/** Returns the recently-viewed ids (client-only; empty until hydrated). */
export function useRecent(): { ids: number[]; ready: boolean } {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  return { ids, ready };
}
