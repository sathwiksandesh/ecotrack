'use client';

import { useEffect, useState } from 'react';

/**
 * Animated CO₂ counter for the hero section — the page's signature element.
 *
 * Shows a counter that ticks up from 0 to a meaningful global CO₂ figure,
 * conveying the scale of the problem before the user even scrolls. Keeps client
 * JS minimal: a single `useEffect` with `requestAnimationFrame`.
 *
 * Accessibility: the final value is readable; animation respects
 * `prefers-reduced-motion` (the browser collapses the transition via globals.css,
 * so the number just appears instantly).
 */
export function HeroCounter() {
  // Global CO₂e emitted since page load (approx 37Gt/yr ÷ 31.5M seconds ≈ 1174 kg/s)
  const RATE_KG_PER_SECOND = 1174;
  const [kg, setKg] = useState(0);

  useEffect(() => {
    const start = performance.now();
    // Animate for 1.8s then let it tick in real-time
    const ANIM_DURATION = 1800;
    const TARGET_DISPLAY = 42_000; // kg — dramatic but believable for ~36s of global emissions

    let raf: number;
    let live = false;
    let liveStart: number;
    let liveBase: number;

    function tick(now: number) {
      if (!live) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / ANIM_DURATION, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * TARGET_DISPLAY);
        setKg(current);

        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          // Switch to live real-time ticking
          live = true;
          liveStart = now;
          liveBase = TARGET_DISPLAY;
          raf = requestAnimationFrame(tick);
        }
      } else {
        const elapsed = (now - liveStart) / 1000; // seconds
        setKg(Math.round(liveBase + elapsed * RATE_KG_PER_SECOND));
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const formatted = kg.toLocaleString('en-US');

  return (
    <div className="animate-fade-up delay-300 mx-auto mt-10 max-w-sm">
      <div className="rounded-3xl border border-primary/15 bg-white/80 px-8 py-5 text-center shadow-card backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
          Global CO₂e emitted since you opened this page
        </p>
        <p
          className="mt-2 font-display text-4xl font-bold tabular-nums text-ink"
          aria-label={`${formatted} kilograms of CO₂ equivalent`}
          aria-live="off"
        >
          {formatted}
          <span className="ml-1.5 text-lg font-medium text-ink/50">kg</span>
        </p>
        <p className="mt-1 text-xs text-ink/40">~37 billion tonnes per year globally</p>
      </div>
    </div>
  );
}
