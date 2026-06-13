import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface CheckboxProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** A single labelled checkbox styled as a card; ≥44px touch target. */
export function Checkbox({ label, description, checked, onChange }: CheckboxProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface',
        checked ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-primary/20 bg-white hover:border-primary/40',
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
      />
      <span className="flex flex-col">
        <span className="font-medium text-ink">{label}</span>
        {description ? <span className="text-sm text-ink/60">{description}</span> : null}
      </span>
    </label>
  );
}
