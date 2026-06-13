'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatTonnes, type HistoryEntry } from '@/lib';
import { ChartFrame, tdClass, thClass } from './ChartFrame';

export interface HistoryTrendChartProps {
  history: HistoryEntry[];
}

/** Stable, locale-fixed short date for axis ticks and the table. */
function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Area chart of total footprint over time, with a data-table fallback. */
export function HistoryTrendChart({ history }: HistoryTrendChartProps) {
  const data = history.map((h) => ({ date: shortDate(h.date), tonnes: h.totalTonnes }));

  const first = history[0];
  const last = history[history.length - 1];
  const trend =
    first && last && first !== last
      ? last.totalTonnes <= first.totalTonnes
        ? `down from ${formatTonnes(first.totalTonnes)} to ${formatTonnes(last.totalTonnes)}`
        : `up from ${formatTonnes(first.totalTonnes)} to ${formatTonnes(last.totalTonnes)}`
      : 'a single recorded calculation';
  const summary = `Footprint over time across ${history.length} calculation${
    history.length === 1 ? '' : 's'
  }: ${trend}.`;

  return (
    <ChartFrame
      title="Footprint over time"
      summary={summary}
      table={
        <>
          <thead>
            <tr>
              <th className={thClass} scope="col">
                Date
              </th>
              <th className={thClass} scope="col">
                Annual footprint
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={`${h.date}-${i}`}>
                <th className={tdClass} scope="row">
                  {shortDate(h.date)}
                </th>
                <td className={tdClass}>{formatTonnes(h.totalTonnes)}</td>
              </tr>
            ))}
          </tbody>
        </>
      }
    >
      <ResponsiveContainer width="100%" height={240}>
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
            width={40}
            tick={{ fill: 'var(--color-ink)', fontSize: 12 }}
            tickFormatter={(v: number) => `${v}t`}
          />
          <Area
            type="monotone"
            dataKey="tonnes"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            fill="url(#trendFill)"
            isAnimationActive={false}
            dot={{ r: 3, fill: 'var(--color-primary)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
