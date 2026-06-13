'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  /** Extra delay in ms before the reveal animation fires. */
  delay?: number;
  className?: string;
}

/**
 * Wraps children in an IntersectionObserver-driven reveal animation.
 *
 * When the element enters the viewport, the `revealed` class is added, which
 * triggers the CSS transition defined in globals.css. Keeps JS minimal — no
 * external library needed. Reduced-motion users see content immediately (the CSS
 * transition collapses to 0.01ms via the prefers-reduced-motion media query).
 */
export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          const id = setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
          return () => clearTimeout(id);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
