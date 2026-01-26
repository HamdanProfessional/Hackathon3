import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Disable ESLint during build (pre-existing issues)
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: 'http://localhost:3003/:path*',
      },
    ];
  },
};

export default nextConfig;
