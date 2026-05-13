import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
  },
  allowedDevOrigins: ["192.168.8.234"],
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000", "192.168.8.234"] },
  },
};

export default nextConfig;
