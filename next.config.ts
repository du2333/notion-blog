import type { NextConfig } from "next";
import blogConfig from "@/blog.config";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    dynamicIO: true,
    cacheLife: {
      custom: {
        revalidate: blogConfig.NEXT_REVALIDATE_SECONDS,
      },
    },
  },
};

export default nextConfig;
