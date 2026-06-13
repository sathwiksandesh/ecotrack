import { Field, fieldControlClasses } from './Field';

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** Short unit shown after the input, e.g. "km / week". */
  unit?: string;
}

/**
 * Numeric input bound to a `number` (not a string). Empty input maps to 0 so the
 * controlled value never becomes NaN. Validation/clamping is the schema's job;
 * `min`/`max` here are native hints, not the source of truth.
 */
export function NumberField({
  label,
  value,
  onChange,
  hint,
  error,
  required,
  min = 0,
  max,
  step,
  unit,
}: NumberFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ controlId, describedBy, invalid }) => (
        <div className="flex items-stretch gap-2">
          <input
            id={controlId}
            type="number"
            inputMode="decimal"
            className={fieldControlClasses}
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max}
            step={step}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e) => {
              const next = e.target.valueAsNumber;
              onChange(Number.isNaN(next) ? 0 : next);
            }}
          />
          {unit ? (
            <span className="flex shrink-0 items-center rounded-2xl bg-surface px-3 text-sm text-ink/70">
              {unit}
            </span>
          ) : null}
        </div>
      )}
    </Field>
  );
}
