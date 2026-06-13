import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'primary' | 'accent' | 'warning' | 'neutral' | 'danger';

const tones: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary-dark',
  accent: 'bg-accent/10 text-accent',
  warning: 'bg-warning/20 text-ink',
  neutral: 'bg-ink/5 text-ink/70',
  danger: 'bg-red-100 text-red-800',
};

export interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

/** Small status/label pill. Carries its own text — never color-only. */
export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
