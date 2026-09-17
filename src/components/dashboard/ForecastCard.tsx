'use client';

import { forecastSixMonths, formatTonnes, type FootprintInput, type HistoryEntry } from '@/lib';
import { Card, Icon } from '@/components/ui';

interface ForecastCardProps {
  input: FootprintInput;
  history: HistoryEntry[];
}

/** Six-month projection and a separate personalized action-plan scenario. */
export function ForecastCard({ input, history }: ForecastCardProps) {
  const forecast = forecastSixMonths(input, history);
  const trendDescription =
    forecast.dataPoints < 2
      ? 'Add another calculator update to turn this baseline into a trend-based forecast.'
      : forecast.dailyTrendKg > 0
        ? 'Your saved trend is increasing.'
        : forecast.dailyTrendKg < 0
          ? 'Your saved trend is decreasing.'
          : 'Your saved trend is stable.';
  const scenarios = [
    [
      'Current annual footprint',
      formatTonnes(forecast.currentKg / 1000),
      'bg-white/85 ring-primary/10',
    ],
    ['AI forecast', formatTonnes(forecast.withoutChangesKg / 1000), 'bg-accent/10 ring-accent/15'],
    [
      'Recommended changes',
      formatTonnes(forecast.withRecommendedChangesKg / 1000),
      'bg-primary/10 ring-primary/15',
    ],
  ];
  return (
    <section aria-labelledby="forecast-heading">
      <Card className="overflow-hidden bg-gradient-to-br from-accent/[0.09] via-white to-primary/[0.08]">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
            <Icon name="chart" size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Six-month outlook
            </p>
            <h2 id="forecast-heading" className="mt-1 font-display text-2xl font-bold text-ink">
              Where will my footprint be in 6 months?
            </h2>
            <p className="mt-2 text-sm text-ink/70">{trendDescription}</p>
          </div>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {scenarios.map(([label, value, color], index) => (
            <div key={label} className={`rounded-2xl p-4 ring-1 ${color}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/55">{label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
              <p className="mt-1 text-xs text-ink/60">
                {index === 1 ? 'Without changes' : index === 2 ? 'With your top actions' : 'Today'}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-ink/55">
          This estimate extrapolates your saved calculator history and applies the app&apos;s top
          three personalized actions. It is a planning estimate, not a measured emissions forecast.
        </p>
      </Card>
    </section>
  );
}
