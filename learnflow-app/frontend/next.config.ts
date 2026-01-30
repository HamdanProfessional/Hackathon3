import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Disable ESLint during build (pre-existing issues)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    // Note: Vercel rewrites cannot proxy to HTTP URLs in production.
    // We use Next.js API routes (/api/proxy/*) instead, which run
    // server-side and can fetch from HTTP backends.
    return [
      // Docs site (local development only)
      {
        source: '/docs',
        destination: 'http://localhost:3003/',
      },
      {
        source: '/docs/:path*',
        destination: 'http://localhost:3003/:path*',
      },
    ];
  },
};

export default nextConfig;
