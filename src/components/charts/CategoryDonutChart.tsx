'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { formatCo2, formatPercent, type CategoryShare } from '@/lib';
import { CATEGORY_META } from '@/components/labels';
import { ChartFrame, tdClass, thClass } from './ChartFrame';

export interface CategoryDonutChartProps {
  breakdown: CategoryShare[];
}

/**
 * Donut chart of category share. A visible legend (text + swatch) accompanies it so
 * meaning never depends on color alone; the table carries the precise figures.
 */
export function CategoryDonutChart({ breakdown }: CategoryDonutChartProps) {
  const nonZero = breakdown.filter((b) => b.kg > 0);
  const data = (nonZero.length > 0 ? nonZero : breakdown).map((b) => ({
    key: b.key,
    name: CATEGORY_META[b.key].label,
    kg: b.kg,
    percent: b.percent,
    fill: CATEGORY_META[b.key].color,
  }));

  const summary = `Share of total emissions: ${breakdown
    .map((b) => `${CATEGORY_META[b.key].label} ${formatPercent(b.percent)}`)
    .join('; ')}.`;

  return (
    <ChartFrame
      title="Share of total emissions"
      summary={summary}
      table={
        <>
          <thead>
            <tr>
              <th className={thClass} scope="col">
                Category
              </th>
              <th className={thClass} scope="col">
                Share
              </th>
              <th className={thClass} scope="col">
                Annual CO₂e
              </th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((b) => (
              <tr key={b.key}>
                <th className={tdClass} scope="row">
                  {CATEGORY_META[b.key].label}
                </th>
                <td className={tdClass}>{formatPercent(b.percent)}</td>
                <td className={tdClass}>{formatCo2(b.kg)}</td>
              </tr>
            ))}
          </tbody>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="kg"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              isAnimationActive={false}
              stroke="var(--color-surface)"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex flex-col gap-2">
          {breakdown.map((b) => (
            <li key={b.key} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: CATEGORY_META[b.key].color }}
              />
              <span className="text-ink/80">
                {CATEGORY_META[b.key].label} — {formatPercent(b.percent)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartFrame>
  );
}
