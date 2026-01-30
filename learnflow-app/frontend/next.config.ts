import type { NextConfig } from "next";

// Backend service URLs (using NodePort on DigitalOcean)
const BACKEND_URL = process.env.BACKEND_URL || 'http://134.209.154.247';

const backendServices = {
  triage: `${BACKEND_URL}:30801`,
  concepts: `${BACKEND_URL}:30802`,
  debug: `${BACKEND_URL}:30803`,
  exercise: `${BACKEND_URL}:30804`,
  progress: `${BACKEND_URL}:30805`,
  codeReview: `${BACKEND_URL}:30806`,
  chat: `${BACKEND_URL}:30807`,
};

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
    // Backend service rewrites to avoid mixed content issues
    // These proxy requests through Vercel (HTTPS) to the backend (HTTP)
    const backendRewrites = [
      // Triage service
      {
        source: '/api/backend/triage/:path*',
        destination: `${backendServices.triage}/:path*`,
      },
      // Concepts service
      {
        source: '/api/backend/concepts/:path*',
        destination: `${backendServices.concepts}/:path*`,
      },
      // Debug service
      {
        source: '/api/backend/debug/:path*',
        destination: `${backendServices.debug}/:path*`,
      },
      // Exercise service
      {
        source: '/api/backend/exercise/:path*',
        destination: `${backendServices.exercise}/:path*`,
      },
      // Progress service
      {
        source: '/api/backend/progress/:path*',
        destination: `${backendServices.progress}/:path*`,
      },
      // Code review service
      {
        source: '/api/backend/code-review/:path*',
        destination: `${backendServices.codeReview}/:path*`,
      },
      // Chat service
      {
        source: '/api/backend/chat/:path*',
        destination: `${backendServices.chat}/:path*`,
      },
      // Modules endpoint (exercise service)
      {
        source: '/api/backend/modules/:path*',
        destination: `${backendServices.exercise}/modules/:path*`,
      },
      // Exercises all endpoint (exercise service)
      {
        source: '/api/backend/exercises/:path*',
        destination: `${backendServices.exercise}/exercises/:path*`,
      },
      // Docs site (local development)
      {
        source: '/docs',
        destination: 'http://localhost:3003/',
      },
      {
        source: '/docs/:path*',
        destination: 'http://localhost:3003/:path*',
      },
    ];

    return backendRewrites;
  },
};

export default nextConfig;
