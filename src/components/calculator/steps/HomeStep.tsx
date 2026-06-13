import { NumberField, SelectField } from '@/components/ui';
import { HEATING_FUELS, HEATING_FUEL_UNIT, type HeatingFuel } from '@/lib';
import { HEATING_FUEL_LABELS, toOptions } from '@/components/labels';
import type { FieldErrors, HomeInput } from '../validation';

export interface HomeStepProps {
  value: HomeInput;
  onChange: (patch: Partial<HomeInput>) => void;
  errors: FieldErrors;
}

/** How to read each fuel's monthly quantity off a bill or delivery. */
const HEATING_AMOUNT_HINT: Record<Exclude<HeatingFuel, 'none'>, string> = {
  gas: 'Cubic metres on your gas bill.',
  oil: 'Litres delivered, averaged per month.',
  lpg: 'Kilograms used — a standard cylinder is ≈ 14.2 kg.',
  wood: 'Kilograms of firewood or pellets burned.',
  electric: 'Metered electricity used for heating.',
  heatpump: 'Electricity the heat pump draws.',
};

/** Step 3 — household energy. Totals are attributed per person via household size. */
export function HomeStep({ value, onChange, errors }: HomeStepProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <NumberField
        label="Electricity use"
        value={value.electricityKwhPerMonth}
        unit="kWh / month"
        hint="Check a recent bill, or estimate."
        error={errors.electricityKwhPerMonth}
        onChange={(electricityKwhPerMonth) => onChange({ electricityKwhPerMonth })}
      />
      <NumberField
        label="Renewable electricity"
        value={value.renewablePercent}
        unit="%"
        max={100}
        hint="Share from a green tariff or your own solar."
        error={errors.renewablePercent}
        onChange={(renewablePercent) => onChange({ renewablePercent })}
      />
      <SelectField
        label="How is your home heated?"
        value={value.heatingFuel}
        options={toOptions<HeatingFuel>(HEATING_FUELS, HEATING_FUEL_LABELS)}
        error={errors.heatingFuel}
        onChange={(heatingFuel) =>
          // The amount's unit is tied to the fuel, so reset it when the unit changes
          // (e.g. m³ → kg) to avoid silently reinterpreting the old number. Switching
          // between fuels that share a unit (electric ↔ heat pump, both kWh) keeps it.
          onChange(
            HEATING_FUEL_UNIT[heatingFuel] === HEATING_FUEL_UNIT[value.heatingFuel]
              ? { heatingFuel }
              : { heatingFuel, heatingAmountPerMonth: 0 },
          )
        }
      />
      {value.heatingFuel !== 'none' && (
        <NumberField
          label="Heating fuel used"
          value={value.heatingAmountPerMonth}
          unit={`${HEATING_FUEL_UNIT[value.heatingFuel]} / month`}
          hint={HEATING_AMOUNT_HINT[value.heatingFuel]}
          error={errors.heatingAmountPerMonth}
          onChange={(heatingAmountPerMonth) => onChange({ heatingAmountPerMonth })}
        />
      )}
      <NumberField
        label="Household size"
        value={value.householdSize}
        unit="people"
        min={1}
        max={20}
        step={1}
        hint="Home energy is shared across everyone living with you."
        error={errors.householdSize}
        onChange={(householdSize) => onChange({ householdSize })}
      />
    </div>
  );
}
