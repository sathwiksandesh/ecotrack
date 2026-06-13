import { Badge, Icon } from '@/components/ui';
import { formatCo2, type Tip } from '@/lib';
import { CATEGORY_META, EFFORT_LABELS } from '@/components/labels';

const EFFORT_TONE = {
  low: 'primary',
  medium: 'warning',
  high: 'neutral',
} as const;

export interface TipCardProps {
  tip: Tip;
  /** 1-based rank used as a visible ordinal. */
  rank: number;
}

/** A single ranked reduction action, showing estimated saving and effort. */
export function TipCard({ tip, rank }: TipCardProps) {
  const category = CATEGORY_META[tip.category];
  return (
    <li className="group flex gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white"
        aria-hidden="true"
      >
        <Icon name={category.icon} size={20} />
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-xs font-bold text-primary/40">#{rank}</span>
          <h3 className="font-semibold text-ink">{tip.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-ink/60">{tip.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge tone="primary">
            <Icon name="leaf" size={13} />
            Saves ~{formatCo2(tip.estimatedSavingKg)}/yr
          </Badge>
          <Badge tone={EFFORT_TONE[tip.effort]}>{EFFORT_LABELS[tip.effort]}</Badge>
          <Badge tone="neutral">{category.label}</Badge>
        </div>
      </div>
    </li>
  );
}
