import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });

// The per-request CSP nonce (set in middleware) can only be stamped onto Next's
// scripts when pages render dynamically; statically prerendered HTML would carry
// no nonce and be blocked by `strict-dynamic`. Rendering is still fast — the pages
// are thin Server Component shells around client islands.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'EcoTrack AI — Understand & reduce your carbon footprint',
  description:
    'Estimate your annual carbon footprint, see where it comes from, and get personalized, high-impact actions to reduce it.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only rounded-md bg-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
