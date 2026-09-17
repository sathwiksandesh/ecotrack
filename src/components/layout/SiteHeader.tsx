'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui';

/**
 * Top navigation. The mobile menu keeps every destination reachable without
 * forcing the compact header to fit the full desktop navigation.
 */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex md:gap-2">
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
            href="/what-if"
            className="hidden rounded-xl px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors duration-150 hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:block"
          >
            What If?
          </Link>
          <Link
            href="/food-tracker"
            className="hidden rounded-xl px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors duration-150 hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:block"
          >
            Food tracker
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

        {/* Mobile nav */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile primary"
          className="border-t border-primary/10 px-4 pb-4 pt-2 md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <Link
              href="/calculator"
              className="rounded-xl px-3.5 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Calculator
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl px-3.5 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/what-if"
              className="rounded-xl px-3.5 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              What If?
            </Link>
            <Link
              href="/food-tracker"
              className="rounded-xl px-3.5 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Food tracker
            </Link>
            <Link
              href="/calculator"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon name="leaf" size={15} />
              Get started
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
