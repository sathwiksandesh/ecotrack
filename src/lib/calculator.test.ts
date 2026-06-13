import { describe, expect, it } from 'vitest';
import { calculateFootprint, heatingFactorFor } from './calculator';
import { footprintInputSchema, type FootprintInput } from './schemas';
import { GRID_INTENSITY, HEAT_PUMP_COP } from './emission-factors';

function build(overrides: Record<string, unknown> = {}): FootprintInput {
  return footprintInputSchema.parse({
    region: 'GLOBAL',
    transport: {},
    home: {},
    food: {},
    consumption: {},
    ...overrides,
  });
}

describe('calculateFootprint', () => {
  it('computes a known baseline scenario exactly', () => {
    const result = calculateFootprint(
      build({
        food: { diet: 'vegan', foodWaste: 'low' },
        consumption: { shopping: 'minimal', recycles: true },
      }),
    );
    // food = 1100 * 1.0 = 1100; consumption = 600 * 0.92 = 552
    expect(result.categories.food).toBeCloseTo(1100);
    expect(result.categories.consumption).toBeCloseTo(552);
    expect(result.categories.transport).toBe(0);
    expect(result.categories.home).toBe(0);
    expect(result.totalKg).toBeCloseTo(1652);
    expect(result.totalTonnes).toBeCloseTo(1.65);
  });

  it('adds petrol car emissions correctly', () => {
    const result = calculateFootprint(
      build({
        transport: { carKmPerWeek: 100, carFuel: 'petrol' },
        food: { diet: 'vegan', foodWaste: 'low' },
        consumption: { shopping: 'minimal', recycles: true },
      }),
    );
    // car = 100 * 52 * 0.192 = 998.4
    expect(result.details.car).toBeCloseTo(998.4);
    expect(result.totalKg).toBeCloseTo(2650.4);
  });

  it('produces lower transport emissions for an electric car than petrol', () => {
    const petrol = calculateFootprint(build({ transport: { carKmPerWeek: 200, carFuel: 'petrol' } }));
    const electric = calculateFootprint(
      build({ transport: { carKmPerWeek: 200, carFuel: 'electric' } }),
    );
    expect(electric.categories.transport).toBeLessThan(petrol.categories.transport);
  });

  it('is monotonic in car distance', () => {
    const less = calculateFootprint(build({ transport: { carKmPerWeek: 100, carFuel: 'petrol' } }));
    const more = calculateFootprint(build({ transport: { carKmPerWeek: 200, carFuel: 'petrol' } }));
    expect(more.totalKg).toBeGreaterThan(less.totalKg);
  });

  it('sums category breakdown to the total', () => {
    const result = calculateFootprint(
      build({
        transport: { carKmPerWeek: 50, carFuel: 'diesel', flightsLongHaulPerYear: 1 },
        home: {
          electricityKwhPerMonth: 300,
          heatingFuel: 'gas',
          heatingAmountPerMonth: 80,
          householdSize: 2,
        },
        food: { diet: 'high_meat', foodWaste: 'high' },
        consumption: { shopping: 'frequent', recycles: false },
      }),
    );
    const sum =
      result.categories.transport +
      result.categories.home +
      result.categories.food +
      result.categories.consumption;
    expect(sum).toBeCloseTo(result.totalKg, 1);
  });

  it('attributes home emissions per person via household size', () => {
    const one = calculateFootprint(
      build({ home: { electricityKwhPerMonth: 100, householdSize: 1, heatingFuel: 'none' } }),
    );
    const two = calculateFootprint(
      build({ home: { electricityKwhPerMonth: 100, householdSize: 2, heatingFuel: 'none' } }),
    );
    expect(one.details.electricity).toBeCloseTo(576); // 100 * 12 * 0.48
    expect(two.details.electricity).toBeCloseTo(one.details.electricity / 2);
  });

  it('zeroes electricity emissions at 100% renewable', () => {
    const result = calculateFootprint(
      build({ home: { electricityKwhPerMonth: 500, renewablePercent: 100, heatingFuel: 'none' } }),
    );
    expect(result.details.electricity).toBe(0);
  });

  it('computes LPG heating from the per-kilogram factor', () => {
    const result = calculateFootprint(
      build({
        home: {
          heatingFuel: 'lpg',
          heatingAmountPerMonth: 10,
          householdSize: 2,
          electricityKwhPerMonth: 0,
        },
      }),
    );
    // 10 kg * 12 * 2.95 / 2 people = 177
    expect(result.details.heating).toBeCloseTo(177);
  });

  it('sums short- and long-haul flights', () => {
    const result = calculateFootprint(
      build({ transport: { flightsLongHaulPerYear: 2, flightsShortHaulPerYear: 3 } }),
    );
    // 2 * 1100 + 3 * 250 = 2950
    expect(result.details.flights).toBeCloseTo(2950);
  });
});

describe('heatingFactorFor', () => {
  it('returns the per-unit factor for combustion fuels regardless of region', () => {
    expect(heatingFactorFor('gas', 'US')).toBeCloseTo(2.02);
    expect(heatingFactorFor('lpg', 'IN')).toBeCloseTo(2.95);
    expect(heatingFactorFor('gas', 'US')).toBe(heatingFactorFor('gas', 'UK'));
  });

  it('uses the grid factor for electric resistance heating', () => {
    expect(heatingFactorFor('electric', 'GLOBAL')).toBeCloseTo(GRID_INTENSITY.GLOBAL);
  });

  it('makes a heat pump cleaner than resistance heating', () => {
    expect(heatingFactorFor('heatpump', 'GLOBAL')).toBeCloseTo(GRID_INTENSITY.GLOBAL / HEAT_PUMP_COP);
    expect(heatingFactorFor('heatpump', 'GLOBAL')).toBeLessThan(heatingFactorFor('electric', 'GLOBAL'));
  });

  it('returns zero for no heating', () => {
    expect(heatingFactorFor('none', 'US')).toBe(0);
  });
});
