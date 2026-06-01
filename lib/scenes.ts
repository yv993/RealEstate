import { IMG } from "./data";

// Verified-loading scenic photos (HTTP 200) chosen to represent Armenia's regions.
// Note: these are representative landscape stand-ins, not exact landmark shots —
// swap any `id` for an authentic Unsplash photo of the exact place when available.
export const SCENES = {
  araratPeak: { id: "1589308078059-be1415eab4c3", alt: "Snow-capped peak above the Armenian highlands" },
  mountains: { id: "1506905925346-21bda4d32df4", alt: "Mountain peaks above the clouds near Tsaghkadzor" },
  valley: { id: "1464822759023-fed622ff2c3b", alt: "Forested mountain valley in northern Armenia" },
  lakeSevan: { id: "1439066615861-d1af74d74000", alt: "Lake Sevan and pine forest" },
  dilijanForest: { id: "1441974231531-c6227db76b6e", alt: "Forest path in Dilijan, Armenia" },
  city: { id: "1565008576549-57569a49371d", alt: "Caucasus city skyline at golden hour" },
  villa: { id: "1602343168117-bb8ffe3e2e9f", alt: "Modern villa with a pool" },
} as const;

export type SceneKey = keyof typeof SCENES;

export const sceneUrl = (key: SceneKey, w = 1900) => IMG(SCENES[key].id, w);
