import type { NextConfig } from 'next';

/**
 * Security headers applied to every response. The Content-Security-Policy is set
 * separately in `src/middleware.ts` because it carries a per-request nonce, which
 * a static header here cannot provide.
 */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the file-tracing root to this project. Without this, a stray lockfile in a
  // parent directory makes Next infer the wrong workspace root (and warn about it).
  outputFileTracingRoot: __dirname,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
