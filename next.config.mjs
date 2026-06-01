/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let ESLint warnings fail the production/Vercel build (types are still checked).
  eslint: { ignoreDuringBuilds: true },
  // Tree-shake large barrel packages down to only the imports actually used.
  experimental: {
    optimizePackageImports: ["lucide-react", "gsap"],
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
