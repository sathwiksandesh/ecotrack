import {
  calculateFootprint,
  categoryBreakdown,
  compareToAverage,
  compareToTarget,
  formatCo2,
  formatNumber,
  formatPercent,
  formatTonnes,
  generateTips,
  type FootprintInput,
  type HistoryEntry,
} from '@/lib';
import { ButtonLink, Card, Icon } from '@/components/ui';
import { REGION_LABELS } from '@/components/labels';
import { CategoryBarChart, CategoryDonutChart, HistoryTrendChart } from '@/components/charts/lazy';
import { StatCard } from './StatCard';
import { ComparisonCard } from './ComparisonCard';
import { TipCard } from './TipCard';
import { GoalTracker } from './GoalTracker';

export interface DashboardViewProps {
  input: FootprintInput;
  history: HistoryEntry[];
}

/**
 * The full results view, pure in its props. All numbers come from `@/lib`; this
 * component only arranges and labels them.
 */
export function DashboardView({ input, history }: DashboardViewProps) {
  const result = calculateFootprint(input);
  const breakdown = categoryBreakdown(result);
  const target = compareToTarget(result.totalTonnes);
  const average = compareToAverage(result.totalTonnes, input.region);
  const tips = generateTips(input, result, { limit: 6 });

  const targetHeadline =
    target.ratio <= 1
      ? 'Within the target'
      : `${formatNumber(target.ratio, 2)}× the target`;
  const averageHeadline = `${formatPercent(average.percentOfAverage)} of average`;

  return (
    <div className="flex flex-col gap-12">

      {/* ── Overview ──────────────────────────────────────────────────── */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Footprint overview</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <StatCard label="Annual footprint" value={formatCo2(result.totalKg)} icon="leaf">
            <p className="text-sm leading-relaxed text-ink/60">
              Across transport, home energy, food, and shopping in{' '}
              {REGION_LABELS[input.region]}.
            </p>
          </StatCard>
          <ComparisonCard
            title="Vs. 1.5°C target"
            status={target.status}
            headline={targetHeadline}
            detail={`Your ${formatTonnes(result.totalTonnes)} compared with a ${formatTonnes(target.target)} science-based personal target.`}
          />
          <ComparisonCard
            title={`Vs. ${REGION_LABELS[input.region]}`}
            status={average.status}
            headline={averageHeadline}
            detail={`The average person there emits about ${formatTonnes(average.average)} per year.`}
          />
        </div>
      </section>

      {/* ── Breakdown ─────────────────────────────────────────────────── */}
      <section aria-labelledby="breakdown-heading" className="flex flex-col gap-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Breakdown</p>
          <h2 id="breakdown-heading" className="mt-1 font-display text-2xl font-bold text-ink">
            Where it comes from
          </h2>
        </header>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink/50">
              By category
            </h3>
            <CategoryBarChart breakdown={breakdown} />
          </Card>
          <Card>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-ink/50">
              Share of total
            </h3>
            <CategoryDonutChart breakdown={breakdown} />
          </Card>
        </div>
      </section>

      {/* ── Goal ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="goal-heading" className="flex flex-col gap-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Goal setting</p>
          <h2 id="goal-heading" className="mt-1 font-display text-2xl font-bold text-ink">
            Track a reduction goal
          </h2>
        </header>
        <GoalTracker currentTonnes={result.totalTonnes} />
      </section>

      {/* ── Tips ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="tips-heading" className="flex flex-col gap-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Action plan</p>
          <h2 id="tips-heading" className="mt-1 font-display text-2xl font-bold text-ink">
            Your highest-impact actions
          </h2>
        </header>
        {tips.length > 0 ? (
          <ol className="grid gap-3 md:grid-cols-2">
            {tips.map((tip, i) => (
              <TipCard key={tip.id} tip={tip} rank={i + 1} />
            ))}
          </ol>
        ) : (
          <Card className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow-sm">
              <Icon name="check" size={22} />
            </span>
            <p className="text-ink/70">
              Your profile is already very low-impact — there are no major reductions left to
              suggest. Nicely done.
            </p>
          </Card>
        )}
      </section>

      {/* ── History ───────────────────────────────────────────────────── */}
      <section aria-labelledby="history-heading" className="flex flex-col gap-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Over time</p>
          <h2 id="history-heading" className="mt-1 font-display text-2xl font-bold text-ink">
            Your progress over time
          </h2>
        </header>
        <Card>
          {history.length > 0 ? (
            <HistoryTrendChart history={history} />
          ) : (
            <p className="text-ink/60">
              Recalculate periodically to build a trend line and watch your footprint change.
            </p>
          )}
        </Card>
      </section>

      <div className="flex justify-center">
        <ButtonLink href="/calculator" variant="secondary" size="lg">
          <Icon name="arrow-left" size={18} />
          Update my answers
        </ButtonLink>
      </div>

    </div>
  );
}
