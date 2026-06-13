import { Card, Badge, Icon } from '@/components/ui';
import type { ComparisonStatus } from '@/lib';

/**
 * Maps a comparison status to an accessible label, tone, and icon. The status is
 * always conveyed in words and an icon — never by color alone.
 */
const STATUS_META: Record<
  ComparisonStatus,
  { label: string; tone: 'primary' | 'warning' | 'danger'; icon: 'check' | 'target' | 'spark' }
> = {
  below: { label: 'On track', tone: 'primary', icon: 'check' },
  near:  { label: 'Close',    tone: 'warning', icon: 'target' },
  above: { label: 'Over',     tone: 'danger',  icon: 'spark' },
};

export interface ComparisonCardProps {
  title: string;
  status: ComparisonStatus;
  /** The headline figure, e.g. "2.6× the target" or "82% of average". */
  headline: string;
  /** A sentence explaining the comparison in plain language. */
  detail: string;
}

export function ComparisonCard({ title, status, headline, detail }: ComparisonCardProps) {
  const meta = STATUS_META[status];
  return (
    <Card className="flex flex-col gap-3" hoverable>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/50">{title}</h3>
        <Badge tone={meta.tone}>
          <Icon name={meta.icon} size={13} />
          {meta.label}
        </Badge>
      </div>
      <p className="font-display text-3xl font-bold text-ink">{headline}</p>
      <p className="text-sm leading-relaxed text-ink/60">{detail}</p>
    </Card>
  );
}
