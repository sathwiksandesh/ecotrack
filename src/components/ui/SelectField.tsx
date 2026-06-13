import { Field, fieldControlClasses } from './Field';
import { cn } from '@/lib/cn';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<SelectOption<T>>;
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
  required?: boolean;
}

/**
 * Native `<select>` — keyboard- and screen-reader-friendly out of the box, and
 * far lighter than a custom listbox. Generic over the option union so callers
 * get a typed `onChange`.
 */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
  error,
  required,
}: SelectFieldProps<T>) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {({ controlId, describedBy, invalid }) => (
        <select
          id={controlId}
          className={cn(fieldControlClasses, 'appearance-none bg-no-repeat pr-10')}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
