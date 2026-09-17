import {
  calculateFootprint,
  CAR_FUEL_FACTOR,
  DIET_FACTOR,
  FLIGHT_FACTOR,
  FOOD_WASTE_MULTIPLIER,
  formatCo2,
  formatNumber,
  GRID_INTENSITY,
  heatingFactorFor,
  MONTHS_PER_YEAR,
  RECYCLING_MULTIPLIER,
  SHOPPING_FACTOR,
  TRANSIT_FACTOR,
  WEEKS_PER_YEAR,
  type FootprintInput,
} from '@/lib';
import { Card } from '@/components/ui';
import {
  CAR_FUEL_LABELS,
  DIET_LABELS,
  HEATING_FUEL_LABELS,
  SHOPPING_LABELS,
} from '@/components/labels';

interface Explanation {
  title: string;
  input: string;
  factor: string;
  calculation: string;
  result: number;
  source: string;
}

function Detail({ item }: { item: Explanation }) {
  return (
    <details className="group rounded-2xl border border-primary/10 bg-white">
      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="flex items-center justify-between gap-3">
          <span>{item.title}</span>
          <span className="text-sm font-medium text-primary group-open:hidden">
            Why this number?
          </span>
          <span className="hidden text-sm font-medium text-primary group-open:inline">
            Hide details
          </span>
        </span>
      </summary>
      <div className="border-t border-primary/10 px-5 py-4 text-sm leading-relaxed text-ink/75">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-ink">Input</dt>
            <dd>{item.input}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Emission factor</dt>
            <dd>{item.factor}</dd>
          </div>
        </dl>
        <div className="mt-4 rounded-xl bg-surface p-4">
          <p className="font-semibold text-ink">Calculation</p>
          <code className="mt-1 block whitespace-pre-wrap font-mono text-xs text-ink/75">
            {item.calculation + '\n= ' + formatCo2(item.result)}
          </code>
        </div>
        <p className="mt-4 text-xs text-ink/55">
          <span className="font-semibold text-ink/70">Source:</span> {item.source}
        </p>
      </div>
    </details>
  );
}

/** Reveals the exact saved inputs, factors, equations, and sources for results. */
export function CalculationExplainability({ input }: { input: FootprintInput }) {
  const result = calculateFootprint(input);
  const { transport, home, food, consumption } = input;
  const carFactor = CAR_FUEL_FACTOR[transport.carFuel];
  const heatingFactor = heatingFactorFor(home.heatingFuel, input.region);
  const n = (value: number, decimals = 0) => formatNumber(value, decimals);
  const items: Explanation[] = [
    {
      title: 'Petrol car',
      input: n(transport.carKmPerWeek) + ' km/week (' + CAR_FUEL_LABELS[transport.carFuel] + ')',
      factor: n(carFactor, 3) + ' kg CO₂e/km',
      calculation: n(transport.carKmPerWeek) + ' × ' + WEEKS_PER_YEAR + ' × ' + n(carFactor, 3),
      result: result.details.car,
      source: 'UK DESNZ / DEFRA greenhouse-gas conversion factors (2023)',
    },
    {
      title: 'Public transport',
      input: n(transport.publicTransitKmPerWeek) + ' km/week',
      factor: n(TRANSIT_FACTOR, 2) + ' kg CO₂e/passenger-km',
      calculation:
        n(transport.publicTransitKmPerWeek) + ' × ' + WEEKS_PER_YEAR + ' × ' + n(TRANSIT_FACTOR, 2),
      result: result.details.transit,
      source: 'UK DESNZ / DEFRA and US EPA transport conversion factors',
    },
    {
      title: 'Flights',
      input:
        transport.flightsShortHaulPerYear +
        ' short-haul + ' +
        transport.flightsLongHaulPerYear +
        ' long-haul flights/year',
      factor:
        'Short-haul: ' +
        formatCo2(FLIGHT_FACTOR.shortHaul) +
        '; long-haul: ' +
        formatCo2(FLIGHT_FACTOR.longHaul),
      calculation:
        transport.flightsShortHaulPerYear +
        ' × ' +
        FLIGHT_FACTOR.shortHaul +
        ' + ' +
        transport.flightsLongHaulPerYear +
        ' × ' +
        FLIGHT_FACTOR.longHaul,
      result: result.details.flights,
      source: 'UK DESNZ / DEFRA greenhouse-gas conversion factors (2023)',
    },
    {
      title: 'Electricity',
      input:
        n(home.electricityKwhPerMonth) +
        ' kWh/month; ' +
        n(home.renewablePercent) +
        '% renewable; ' +
        home.householdSize +
        '-person household',
      factor: n(GRID_INTENSITY[input.region], 2) + ' kg CO₂e/kWh regional grid intensity',
      calculation:
        n(home.electricityKwhPerMonth) +
        ' × ' +
        MONTHS_PER_YEAR +
        ' × ' +
        n(GRID_INTENSITY[input.region], 2) +
        ' × (1 − ' +
        n(home.renewablePercent) +
        '%) ÷ ' +
        home.householdSize,
      result: result.details.electricity,
      source: 'IEA / Ember regional electricity-grid intensity (2023)',
    },
    {
      title: 'Heating',
      input:
        n(home.heatingAmountPerMonth) +
        ' units/month (' +
        HEATING_FUEL_LABELS[home.heatingFuel] +
        ')',
      factor: n(heatingFactor, 3) + ' kg CO₂e/unit',
      calculation:
        n(home.heatingAmountPerMonth) +
        ' × ' +
        MONTHS_PER_YEAR +
        ' × ' +
        n(heatingFactor, 3) +
        ' ÷ ' +
        home.householdSize,
      result: result.details.heating,
      source:
        home.heatingFuel === 'electric' || home.heatingFuel === 'heatpump'
          ? 'IEA / Ember regional electricity-grid intensity (2023)'
          : 'UK DESNZ / DEFRA greenhouse-gas conversion factors (2023)',
    },
    {
      title: 'Food',
      input: DIET_LABELS[food.diet] + '; ' + food.foodWaste + ' food waste',
      factor:
        n(DIET_FACTOR[food.diet]) +
        ' kg CO₂e/year × ' +
        n(FOOD_WASTE_MULTIPLIER[food.foodWaste], 2) +
        ' waste multiplier',
      calculation: n(DIET_FACTOR[food.diet]) + ' × ' + n(FOOD_WASTE_MULTIPLIER[food.foodWaste], 2),
      result: result.categories.food,
      source: 'Scarborough et al. (2023), dietary greenhouse-gas footprints',
    },
    {
      title: 'Shopping & goods',
      input:
        SHOPPING_LABELS[consumption.shopping] +
        '; ' +
        (consumption.recycles ? 'recycles routinely' : 'does not recycle routinely'),
      factor:
        n(SHOPPING_FACTOR[consumption.shopping]) +
        ' kg CO₂e/year × ' +
        n(consumption.recycles ? RECYCLING_MULTIPLIER : 1, 2),
      calculation:
        n(SHOPPING_FACTOR[consumption.shopping]) +
        ' × ' +
        n(consumption.recycles ? RECYCLING_MULTIPLIER : 1, 2),
      result: result.categories.consumption,
      source: 'EcoTrack methodology, informed by consumption lifecycle studies',
    },
  ];
  return (
    <section aria-labelledby="method-heading">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Transparent methodology
        </p>
        <h2 id="method-heading" className="mt-1 font-display text-2xl font-bold text-ink">
          Why these numbers?
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/70">
          Open any calculation to see the saved input, emission factor, formula, result, and source.
          These are awareness estimates, not audit-grade accounting.
        </p>
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <Detail key={item.title} item={item} />
          ))}
        </div>
      </Card>
    </section>
  );
}
