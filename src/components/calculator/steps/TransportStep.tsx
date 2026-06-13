import { NumberField, SelectField } from '@/components/ui';
import { CAR_FUELS, type CarFuel } from '@/lib';
import { CAR_FUEL_LABELS, toOptions } from '@/components/labels';
import type { FieldErrors, TransportInput } from '../validation';

export interface TransportStepProps {
  value: TransportInput;
  onChange: (patch: Partial<TransportInput>) => void;
  errors: FieldErrors;
}

/** Step 2 — driving, transit, and flights. */
export function TransportStep({ value, onChange, errors }: TransportStepProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <SelectField
        label="What do you drive?"
        value={value.carFuel}
        options={toOptions<CarFuel>(CAR_FUELS, CAR_FUEL_LABELS)}
        error={errors.carFuel}
        onChange={(carFuel) => onChange({ carFuel })}
      />
      <NumberField
        label="Distance driven"
        value={value.carKmPerWeek}
        unit="km / week"
        hint="Roughly how far you drive in a typical week."
        error={errors.carKmPerWeek}
        onChange={(carKmPerWeek) => onChange({ carKmPerWeek })}
      />
      <NumberField
        label="Public transport"
        value={value.publicTransitKmPerWeek}
        unit="km / week"
        hint="Bus, train, tram or metro distance per week."
        error={errors.publicTransitKmPerWeek}
        onChange={(publicTransitKmPerWeek) => onChange({ publicTransitKmPerWeek })}
      />
      <NumberField
        label="Short-haul flights"
        value={value.flightsShortHaulPerYear}
        unit="per year"
        step={1}
        hint="Under ~4 hours, one-way trips per year."
        error={errors.flightsShortHaulPerYear}
        onChange={(flightsShortHaulPerYear) => onChange({ flightsShortHaulPerYear })}
      />
      <NumberField
        label="Long-haul flights"
        value={value.flightsLongHaulPerYear}
        unit="per year"
        step={1}
        hint="Over ~4 hours, one-way trips per year."
        error={errors.flightsLongHaulPerYear}
        onChange={(flightsLongHaulPerYear) => onChange({ flightsLongHaulPerYear })}
      />
    </div>
  );
}
