'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatCo2, type HistoryEntry } from '@/lib';
import { ChartFrame, tdClass, thClass } from './ChartFrame';

const PERIODS = [
  ['today', 'Today', 1],
  ['7d', '7 days', 7],
  ['30d', '30 days', 30],
  ['6m', '6 months', 183],
  ['1y', '1 year', 365],
] as const;
const METRICS = [
  ['totalKg', 'CO₂ over time', 'Total footprint'],
  ['transport', 'Transport emissions', 'Transport'],
  ['food', 'Food emissions', 'Food'],
  ['electricity', 'Electricity', 'Electricity'],
  ['shopping', 'Shopping', 'Shopping'],
  ['waste', 'Waste', 'Food waste'],
] as const;
type Metric = (typeof METRICS)[number][0];

function shortDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function metricValue(entry: HistoryEntry, metric: Metric): number | undefined {
  return metric === 'totalKg' ? entry.totalKg : entry.categories?.[metric];
}

/** Interactive, period-filtered footprint and category trend chart. */
export function HistoryTrendChart({ history }: { history: HistoryEntry[] }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number][0]>('1y');
  const [metric, setMetric] = useState<Metric>('totalKg');
  const days = PERIODS.find(([id]) => id === period)![2];
  const filtered = useMemo(() => {
    const newest = Math.max(...history.map((entry) => new Date(entry.date).getTime()));
    const cutoff = newest - days * 86_400_000;
    return history.filter((entry) => new Date(entry.date).getTime() >= cutoff);
  }, [days, history]);
  const hasCategoryData = filtered.some((entry) => entry.categories);
  const data = filtered
    .map((entry) => ({ date: shortDate(entry.date), value: metricValue(entry, metric) }))
    .filter((entry): entry is { date: string; value: number } => entry.value !== undefined);
  const metricLabel = METRICS.find(([id]) => id === metric)![2];
  const categoryUnavailable = metric !== 'totalKg' && !hasCategoryData;
  const summary = categoryUnavailable
    ? `${metricLabel} history will appear after your next calculator update.`
    : `${metricLabel} across ${data.length} saved calculation${data.length === 1 ? '' : 's'} in the selected period.`;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Your carbon trend
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-ink">
            Explore your footprint over time
          </h3>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Time period">
          {PERIODS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPeriod(id)}
              aria-pressed={period === id}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${period === id ? 'bg-primary text-white' : 'bg-primary/8 text-primary hover:bg-primary/15'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Emissions category">
          {METRICS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMetric(id)}
              aria-pressed={metric === id}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${metric === id ? 'bg-accent text-white' : 'bg-accent/10 text-accent hover:bg-accent/15'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {categoryUnavailable ? (
        <p className="rounded-2xl bg-surface p-5 text-sm leading-relaxed text-ink/70">
          Category trend data is collected from new calculator updates. Your previous total CO₂
          history remains available.
        </p>
      ) : data.length === 0 ? (
        <p className="rounded-2xl bg-surface p-5 text-sm text-ink/70">
          No saved calculations fall within this period. Choose a longer period or update your
          calculator.
        </p>
      ) : (
        <ChartFrame
          title={metricLabel}
          summary={summary}
          table={
            <>
              <thead>
                <tr>
                  <th className={thClass} scope="col">
                    Date
                  </th>
                  <th className={thClass} scope="col">
                    {metricLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={`${entry.date}-${index}`}>
                    <th className={tdClass} scope="row">
                      {entry.date}
                    </th>
                    <td className={tdClass}>{formatCo2(entry.value)}</td>
                  </tr>
                ))}
              </tbody>
            </>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink)" strokeOpacity={0.08} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--color-ink)', fontSize: 12 }}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                tick={{ fill: 'var(--color-ink)', fontSize: 12 }}
                tickFormatter={(value: number) => `${Math.round(value)} kg`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#trendFill)"
                isAnimationActive={false}
                dot={{ r: 3, fill: 'var(--color-primary)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
      )}
    </div>
  );
}
