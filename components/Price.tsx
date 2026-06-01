"use client";

import { useCurrency } from "@/lib/currency";
import type { Property } from "@/lib/data";

/** Currency-aware price text. Pass a property (handles rent suffix) or a raw USD amount. */
export function Price({ p, usd, period }: { p?: Property; usd?: number; period?: "month" }) {
  const { format } = useCurrency();
  const amount = p ? p.price : usd ?? 0;
  const isRent = p ? p.listingType === "rent" : !!period;
  const per = p?.rentPeriod ?? period ?? "month";
  return (
    <>
      {format(amount)}
      {isRent ? ` / ${per}` : ""}
    </>
  );
}
