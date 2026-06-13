import { NextResponse, type NextRequest } from 'next/server';

/**
 * Per-request Content Security Policy with a fresh nonce.
 *
 * A static `script-src 'self'` blocks Next.js's own inline bootstrap/hydration
 * scripts, so the app would render but never become interactive. Rather than
 * weaken the policy with `'unsafe-inline'`, we mint a nonce per request and let
 * Next.js attach it to every script it emits. Combined with `'strict-dynamic'`,
 * this is the strongest practical CSP for an App Router app: inline scripts run
 * only if they carry our nonce, and `'self'`/`'unsafe-inline'` are ignored by
 * supporting browsers.
 *
 * Dev only: React Fast Refresh evaluates code via `eval`, and HMR talks over a
 * WebSocket, so `'unsafe-eval'` and `ws:` are added when NODE_ENV is development.
 * Neither is present in production.
 *
 * See SECURITY.md and https://nextjs.org/docs/app/guides/content-security-policy.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // Next.js / Tailwind inject inline <style> tags; styles are a far lower-risk
    // sink than scripts, so 'unsafe-inline' is accepted here.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  // Expose the nonce to the renderer so Next.js can stamp its scripts with it.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  // Run on document requests only — skip static assets, the image optimizer,
  // and prefetches (which don't execute scripts and shouldn't pay for a nonce).
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
