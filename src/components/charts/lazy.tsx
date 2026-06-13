'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy chart entry points.
 *
 * Recharts is heavy, so each chart is loaded on demand with `ssr: false` — this
 * keeps the (~) chart bundle out of the initial dashboard payload (Efficiency axis).
 * While a chart loads, a height-matched skeleton holds the layout to avoid shift.
 */

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="w-full animate-pulse rounded-2xl bg-primary/5"
      style={{ height }}
      aria-hidden="true"
    />
  );
}

export const CategoryBarChart = dynamic(
  () => import('./CategoryBarChart').then((m) => m.CategoryBarChart),
  { ssr: false, loading: () => <ChartSkeleton height={200} /> },
);

export const CategoryDonutChart = dynamic(
  () => import('./CategoryDonutChart').then((m) => m.CategoryDonutChart),
  { ssr: false, loading: () => <ChartSkeleton height={200} /> },
);

export const HistoryTrendChart = dynamic(
  () => import('./HistoryTrendChart').then((m) => m.HistoryTrendChart),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> },
);
