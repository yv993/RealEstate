// Content-Security-Policy allowing exactly what the app needs: Supabase, Unsplash,
// simpleicons, Google Fonts, CARTO/OSM map tiles, and Vercel analytics. Uses
// 'unsafe-inline' for scripts because Next ships a small inline theme script and
// hydration without a nonce pipeline.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.simpleicons.org https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://*.supabase.co",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.ingest.sentry.io",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let ESLint warnings fail the production/Vercel build (types are still checked).
  eslint: { ignoreDuringBuilds: true },
  // Tree-shake large barrel packages down to only the imports actually used.
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      // Supabase Storage (project subdomain is env-specific, so allow any).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

// Only pull in @next/bundle-analyzer when explicitly running an analysis
// (ANALYZE=true). This keeps it out of the normal production build, so a
// dev-only dependency can never break deploys (e.g. on Vercel).
export default async () => {
  if (process.env.ANALYZE === "true") {
    const { default: withBundleAnalyzer } = await import("@next/bundle-analyzer");
    return withBundleAnalyzer({ enabled: true, openAnalyzer: false })(nextConfig);
  }
  return nextConfig;
};
