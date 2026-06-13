import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Shared accessible scaffolding for a single labelled form control.
 *
 * Returns the ids a control must wire up (`controlId`, `describedBy`) and renders
 * the label, optional hint, and an error region that is always present in the DOM
 * with `aria-live="polite"` so screen readers announce validation changes.
 */
export interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Render-prop receiving the ids the control must apply. */
  children: (ids: { controlId: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
  className?: string;
}

export function Field({ label, hint, error, required, children, className }: FieldShellProps) {
  const controlId = useId();
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const invalid = Boolean(error);

  const describedBy = cn(hint && hintId, invalid && errorId) || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={controlId} className="font-medium text-ink">
        {label}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-ink/60">
          {hint}
        </p>
      ) : null}
      {children({ controlId, describedBy, invalid })}
      <p id={errorId} aria-live="polite" className="min-h-[1.25rem] text-sm font-medium text-red-700">
        {error}
      </p>
    </div>
  );
}

export const fieldControlClasses =
  'w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-ink shadow-sm ' +
  'transition-colors placeholder:text-ink/40 ' +
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary ' +
  'aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500';
