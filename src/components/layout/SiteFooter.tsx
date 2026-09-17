import Link from 'next/link';
import { Icon } from '@/components/ui';

/**
 * Site footer. Static Server Component. Links are same-origin only,
 * keeping the strict CSP intact.
 */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-primary/10 bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand + tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-glow-sm">
                <Icon name="leaf" size={16} />
              </span>
              <span className="font-display font-bold text-ink">EcoTrack AI</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink/50">
              Private, science-based carbon footprint tracking — entirely in your browser.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">Navigate</p>
            <Link href="/" className="text-sm text-ink/60 transition-colors hover:text-primary">Home</Link>
            <Link href="/calculator" className="text-sm text-ink/60 transition-colors hover:text-primary">Calculator</Link>
            <Link href="/dashboard" className="text-sm text-ink/60 transition-colors hover:text-primary">Dashboard</Link>
          </nav>

          {/* Trust note */}
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">Methodology</p>
            <p className="text-sm leading-relaxed text-ink/50">
              Estimates are for awareness and relative comparison, not audit-grade accounting.
              Emission factors sourced from DEFRA, US EPA, and the IEA.
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col gap-2 border-t border-primary/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink/40">
            © {new Date().getFullYear()} EcoTrack AI · Made ❤️ by Siddhantam Sathwik Sandesh 
          </p>
          <div className="flex items-center gap-1.5 text-xs text-ink/40">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            No data leaves your device
          </div>
        </div>
      </div>
    </footer>
  );
}
