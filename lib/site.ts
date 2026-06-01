// Canonical site URL used for SEO (sitemap, robots, Open Graph, JSON-LD).
// Set NEXT_PUBLIC_SITE_URL in production (e.g. your Vercel domain).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://evergreen.am").replace(/\/$/, "");
export const SITE_NAME = "EverGreen";
