import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default withBundleAnalyzer(nextConfig);
