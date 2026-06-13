import type { ReactNode } from 'react';
import { Card, Icon } from '@/components/ui';
import type { IconName } from '@/components/ui';

export interface StatCardProps {
  label: string;
  value: string;
  icon?: IconName;
  children?: ReactNode;
}

/** Headline metric card: a label, a large value, and optional supporting content. */
export function StatCard({ label, value, icon, children }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3" hoverable>
      <div className="flex items-center gap-2.5">
        {icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-glow-sm">
            <Icon name={icon} size={20} />
          </span>
        ) : null}
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">{label}</p>
      </div>
      <p className="font-display text-4xl font-bold text-ink">{value}</p>
      {children}
    </Card>
  );
}
