import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface RadioGroupProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  options: ReadonlyArray<RadioOption<T>>;
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
}

/**
 * Radio group rendered as selectable cards inside a `<fieldset>`/`<legend>`.
 *
 * Uses real `<input type="radio">` elements (visually hidden, peer-driven styling)
 * so keyboard arrow-key navigation, focus, and screen-reader semantics are native.
 * The error region is `aria-live` and linked from the fieldset via aria-describedby.
 */
export function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  hint,
  error,
}: RadioGroupProps<T>) {
  const baseId = useId();
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
      <legend className="font-medium text-ink">{legend}</legend>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink/60">
          {hint}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const id = `${baseId}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface',
                checked
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-primary/20 bg-white hover:border-primary/40',
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <span className="flex flex-col">
                <span className="font-medium text-ink">{opt.label}</span>
                {opt.description ? (
                  <span className="text-sm text-ink/60">{opt.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <p id={errorId} aria-live="polite" className="min-h-[1.25rem] text-sm font-medium text-red-700">
        {error}
      </p>
    </fieldset>
  );
}
