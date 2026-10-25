import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents disabled to allow dynamic SSR rendering with NextAuth
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
