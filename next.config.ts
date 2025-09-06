import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["t.vndb.org"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
