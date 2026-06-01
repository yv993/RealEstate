"use client";

import { track as vercelTrack } from "@vercel/analytics";

// Thin, privacy-friendly conversion-event wrapper. No-ops when Vercel Analytics
// isn't active (e.g. local dev). Never throws.
export function track(event: string, props?: Record<string, string | number | boolean | null>) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics not available — ignore */
  }
}
