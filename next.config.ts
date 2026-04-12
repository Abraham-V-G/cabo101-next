import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {}, // ✅ correcto (no false)
  },
};

export default nextConfig;
