import { RadioGroup } from '@/components/ui';
import { DIETS, FOOD_WASTE_LEVELS, type Diet, type FoodWaste } from '@/lib';
import { DIET_LABELS, FOOD_WASTE_LABELS } from '@/components/labels';
import type { FieldErrors, FoodInput } from '../validation';

export interface FoodStepProps {
  value: FoodInput;
  onChange: (patch: Partial<FoodInput>) => void;
  errors: FieldErrors;
}

/** Step 4 — diet and food waste. */
export function FoodStep({ value, onChange, errors }: FoodStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <RadioGroup
        legend="Which best describes your diet?"
        name="diet"
        value={value.diet}
        error={errors.diet}
        onChange={(diet: Diet) => onChange({ diet })}
        options={DIETS.map((d) => ({ value: d, label: DIET_LABELS[d] }))}
      />
      <RadioGroup
        legend="How much food do you waste?"
        name="foodWaste"
        value={value.foodWaste}
        error={errors.foodWaste}
        onChange={(foodWaste: FoodWaste) => onChange({ foodWaste })}
        options={FOOD_WASTE_LEVELS.map((w) => ({ value: w, label: FOOD_WASTE_LABELS[w] }))}
      />
    </div>
  );
}
