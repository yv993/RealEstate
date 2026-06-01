"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Listing data is stored in USD internally; we convert to AMD for display only.
export const USD_TO_AMD = 387;
const KEY = "evergreen:currency";

export type Currency = "USD" | "AMD";

export function formatMoney(usd: number, currency: Currency): string {
  if (currency === "AMD") return "֏" + Math.round(usd * USD_TO_AMD).toLocaleString("en-US");
  return "$" + Math.round(usd).toLocaleString("en-US");
}

type CurrencyCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  ready: boolean;
  format: (usd: number) => string;
};

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Default AMD (matches server render); load the saved choice after mount.
  const [currency, setCur] = useState<Currency>("AMD");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === "USD" || s === "AMD") setCur(s);
    } catch {}
    setReady(true);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCur(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {}
  }, []);

  const format = useCallback((usd: number) => formatMoney(usd, currency), [currency]);

  return <Ctx.Provider value={{ currency, setCurrency, ready, format }}>{children}</Ctx.Provider>;
}

export function useCurrency(): CurrencyCtx {
  const c = useContext(Ctx);
  if (!c) return { currency: "AMD", setCurrency: () => {}, ready: false, format: (u: number) => formatMoney(u, "AMD") };
  return c;
}
