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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "tugas.hideo.id" }],
        destination: "https://tasks.hideo.id/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
