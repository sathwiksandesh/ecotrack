import { Icon } from './Icon';
import { cn } from '@/lib/cn';

export interface StepperProps {
  steps: ReadonlyArray<string>;
  /** Zero-based index of the active step. */
  current: number;
}

/**
 * Horizontal step indicator for the multi-step form.
 *
 * Rendered as an ordered list with `aria-current="step"` on the active one.
 * Past steps show a check icon; future steps show their number.
 */
export function Stepper({ steps, current }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <p className="sr-only">
        Step {current + 1} of {steps.length}: {steps[current]}
      </p>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-3">
        {steps.map((label, i) => {
          const status = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
          return (
            <li key={label} className="flex items-center gap-1.5">
              <span
                aria-current={status === 'current' ? 'step' : undefined}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  'transition-all duration-300 ease-spring',
                  status === 'complete' &&
                    'bg-primary text-white shadow-glow-sm',
                  status === 'current' &&
                    'bg-primary text-white ring-4 ring-primary/20',
                  status === 'upcoming' &&
                    'bg-white text-ink/40 ring-1 ring-primary/15',
                )}
              >
                {status === 'complete' ? (
                  <Icon name="check" size={15} />
                ) : (
                  <span aria-hidden="true">{i + 1}</span>
                )}
              </span>
              <span
                className={cn(
                  'text-sm transition-colors duration-200',
                  status === 'current' ? 'font-semibold text-ink' : 'text-ink/50',
                )}
              >
                {label}
                <span className="sr-only">
                  {status === 'complete'
                    ? ' (completed)'
                    : status === 'current'
                      ? ' (current)'
                      : ''}
                </span>
              </span>
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden h-px w-5 transition-colors duration-300 sm:block',
                    i < current ? 'bg-primary/40' : 'bg-primary/15',
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
