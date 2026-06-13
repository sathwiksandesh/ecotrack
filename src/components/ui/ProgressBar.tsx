import { cn } from '@/lib/cn';

export interface ProgressBarProps {
  /** Current value, clamped into [min, max]. */
  value: number;
  min?: number;
  max?: number;
  label: string;
  /** Human-readable value text announced to AT, e.g. "62% of target". */
  valueText?: string;
  /** Visual tone of the fill. */
  tone?: 'primary' | 'accent' | 'warning';
  className?: string;
}

const tones = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  warning: 'bg-warning',
} as const;

/**
 * Accessible progress/meter bar. Exposes `role="progressbar"` with aria value
 * attributes; the visible fill never relies on color alone because a text value
 * accompanies it wherever this is used.
 */
export function ProgressBar({
  value,
  min = 0,
  max = 100,
  label,
  valueText,
  tone = 'primary',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={valueText}
      className={cn('h-3 w-full overflow-hidden rounded-full bg-primary/10', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
