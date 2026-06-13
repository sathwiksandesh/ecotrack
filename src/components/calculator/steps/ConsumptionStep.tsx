import { Checkbox, RadioGroup } from '@/components/ui';
import { SHOPPING_LEVELS, type Shopping } from '@/lib';
import { SHOPPING_LABELS } from '@/components/labels';
import type { ConsumptionInput, FieldErrors } from '../validation';

export interface ConsumptionStepProps {
  value: ConsumptionInput;
  onChange: (patch: Partial<ConsumptionInput>) => void;
  errors: FieldErrors;
}

/** Step 5 — shopping habits and recycling. */
export function ConsumptionStep({ value, onChange, errors }: ConsumptionStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <RadioGroup
        legend="How much do you buy?"
        hint="Clothes, electronics, and other goods beyond essentials."
        name="shopping"
        value={value.shopping}
        error={errors.shopping}
        onChange={(shopping: Shopping) => onChange({ shopping })}
        options={SHOPPING_LEVELS.map((s) => ({ value: s, label: SHOPPING_LABELS[s] }))}
      />
      <fieldset>
        <legend className="font-medium text-ink">Recycling</legend>
        <p className="mt-1 text-sm text-ink/60">Do you recycle household waste routinely?</p>
        <div className="mt-3">
          <Checkbox
            label="I recycle consistently"
            description="Paper, glass, metal and plastics most weeks."
            checked={value.recycles}
            onChange={(recycles) => onChange({ recycles })}
          />
        </div>
      </fieldset>
    </div>
  );
}
