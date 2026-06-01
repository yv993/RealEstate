// A tiny neutral blur placeholder for next/image on remote (Unsplash/Supabase)
// photos, which can't auto-generate one. A 1x1 warm-grey PNG that next/image
// scales + blurs while the real image loads. Static string so it works in both
// server and client bundles (no Buffer at runtime).
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPMnf+/HgAGgQK13E8AlQAAAABJRU5ErkJggg==";
