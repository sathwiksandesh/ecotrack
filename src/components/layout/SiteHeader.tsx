import Link from 'next/link';
import { Icon } from '@/components/ui';

/**
 * Top navigation. Plain Server Component — no client state needed. The two primary
 * destinations (Calculator, Dashboard) are always reachable; the brand returns home.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl px-1 font-display text-lg font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-glow-sm transition-shadow duration-200 group-hover:shadow-glow">
            <Icon name="leaf" size={20} />
          </span>
          <span className="hidden sm:block">EcoTrack AI</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/calculator"
            className="rounded-xl px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors duration-150 hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Calculator
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors duration-150 hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/calculator"
            className="ml-1 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Start the carbon footprint calculator"
          >
            <Icon name="leaf" size={15} />
            <span className="hidden sm:block">Get started</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
