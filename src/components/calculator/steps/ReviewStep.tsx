import { calculateFootprint, formatCo2, HEATING_FUEL_UNIT, type FootprintInput } from '@/lib';
import {
  CAR_FUEL_LABELS,
  DIET_LABELS,
  FOOD_WASTE_LABELS,
  HEATING_FUEL_LABELS,
  REGION_LABELS,
  SHOPPING_LABELS,
} from '@/components/labels';

export interface ReviewStepProps {
  input: FootprintInput;
}

interface Row {
  label: string;
  value: string;
}

/** Step 6 — a read-only recap plus a live estimate of the annual total. */
export function ReviewStep({ input }: ReviewStepProps) {
  const result = calculateFootprint(input);

  const groups: { heading: string; rows: Row[] }[] = [
    {
      heading: 'Region',
      rows: [{ label: 'Location', value: REGION_LABELS[input.region] }],
    },
    {
      heading: 'Transport',
      rows: [
        { label: 'Car', value: `${CAR_FUEL_LABELS[input.transport.carFuel]}` },
        { label: 'Driving', value: `${input.transport.carKmPerWeek} km / week` },
        { label: 'Public transport', value: `${input.transport.publicTransitKmPerWeek} km / week` },
        {
          label: 'Flights',
          value: `${input.transport.flightsShortHaulPerYear} short · ${input.transport.flightsLongHaulPerYear} long / year`,
        },
      ],
    },
    {
      heading: 'Home',
      rows: [
        { label: 'Electricity', value: `${input.home.electricityKwhPerMonth} kWh / month` },
        { label: 'Renewable share', value: `${input.home.renewablePercent}%` },
        { label: 'Heating', value: HEATING_FUEL_LABELS[input.home.heatingFuel] },
        {
          label: 'Heating fuel used',
          value:
            input.home.heatingFuel === 'none'
              ? '—'
              : `${input.home.heatingAmountPerMonth} ${HEATING_FUEL_UNIT[input.home.heatingFuel]} / month`,
        },
        { label: 'Household size', value: `${input.home.householdSize}` },
      ],
    },
    {
      heading: 'Food',
      rows: [
        { label: 'Diet', value: DIET_LABELS[input.food.diet] },
        { label: 'Food waste', value: FOOD_WASTE_LABELS[input.food.foodWaste] },
      ],
    },
    {
      heading: 'Shopping & goods',
      rows: [
        { label: 'Shopping', value: SHOPPING_LABELS[input.consumption.shopping] },
        { label: 'Recycles', value: input.consumption.recycles ? 'Yes' : 'No' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-primary/5 p-6 text-center ring-1 ring-primary/10">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-dark">
          Estimated annual footprint
        </p>
        <p className="mt-1 font-display text-4xl font-bold text-ink">{formatCo2(result.totalKg)}</p>
        <p className="mt-1 text-sm text-ink/60">
          Submit to save your profile and open the full breakdown.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.heading} className="rounded-2xl border border-primary/10 bg-white p-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-primary-dark">
              {group.heading}
            </h3>
            <div className="mt-2 flex flex-col gap-1.5">
              {group.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 text-sm">
                  <dt className="text-ink/60">{row.label}</dt>
                  <dd className="text-right font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
