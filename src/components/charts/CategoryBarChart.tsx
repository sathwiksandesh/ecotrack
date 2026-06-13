'use client';

import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { formatCo2, formatPercent, type CategoryShare } from '@/lib';
import { CATEGORY_META } from '@/components/labels';
import { ChartFrame, tdClass, thClass } from './ChartFrame';

export interface CategoryBarChartProps {
  breakdown: CategoryShare[];
}

/** Horizontal bar chart of emissions by category, with a data-table fallback. */
export function CategoryBarChart({ breakdown }: CategoryBarChartProps) {
  const data = breakdown.map((b) => ({
    name: CATEGORY_META[b.key].label,
    kg: b.kg,
    percent: b.percent,
    fill: CATEGORY_META[b.key].color,
  }));

  const summary = `Emissions by category: ${breakdown
    .map((b) => `${CATEGORY_META[b.key].label} ${formatCo2(b.kg)} (${formatPercent(b.percent)})`)
    .join('; ')}.`;

  return (
    <ChartFrame
      title="Emissions by category"
      summary={summary}
      table={
        <>
          <thead>
            <tr>
              <th className={thClass} scope="col">
                Category
              </th>
              <th className={thClass} scope="col">
                Annual CO₂e
              </th>
              <th className={thClass} scope="col">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((b) => (
              <tr key={b.key}>
                <th className={tdClass} scope="row">
                  {CATEGORY_META[b.key].label}
                </th>
                <td className={tdClass}>{formatCo2(b.kg)}</td>
                <td className={tdClass}>{formatPercent(b.percent)}</td>
              </tr>
            ))}
          </tbody>
        </>
      }
    >
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 56)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={96}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-ink)', fontSize: 13 }}
          />
          <Bar dataKey="kg" radius={[0, 8, 8, 0]} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
