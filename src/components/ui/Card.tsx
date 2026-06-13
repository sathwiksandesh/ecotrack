import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Surface container with the "Living Data" aesthetic: rounded, multi-layered
 * shadow, gentle green-tinted ring. Renders a semantic element of your choice.
 */
interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  /** Apply a subtle hover lift transition — use on interactive-feeling cards. */
  hoverable?: boolean;
}

export function Card({ as: Tag = 'div', className, children, hoverable = false, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-3xl bg-white p-6 shadow-card ring-1 ring-primary/8 sm:p-8',
        hoverable && 'transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
