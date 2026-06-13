import { describe, expect, it } from 'vitest';
import {
  footprintInputSchema,
  defaultFootprintInput,
  goalSchema,
  historySchema,
} from './schemas';

describe('footprintInputSchema', () => {
  it('accepts the exported default input', () => {
    expect(footprintInputSchema.safeParse(defaultFootprintInput).success).toBe(true);
  });

  it('applies sensible defaults for omitted fields', () => {
    const parsed = footprintInputSchema.parse({
      transport: {},
      home: {},
      food: {},
      consumption: {},
    });
    expect(parsed.region).toBe('GLOBAL');
    expect(parsed.transport.carFuel).toBe('petrol');
    expect(parsed.transport.carKmPerWeek).toBe(0);
    expect(parsed.home.householdSize).toBe(1);
    expect(parsed.consumption.recycles).toBe(false);
  });

  it('rejects negative distances', () => {
    const result = footprintInputSchema.safeParse({
      region: 'GLOBAL',
      transport: { carKmPerWeek: -5 },
      home: {},
      food: {},
      consumption: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown enum values', () => {
    const result = footprintInputSchema.safeParse({
      region: 'GLOBAL',
      transport: { carFuel: 'rocket' },
      home: {},
      food: {},
      consumption: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects renewable percentages above 100', () => {
    const result = footprintInputSchema.safeParse({
      region: 'GLOBAL',
      transport: {},
      home: { renewablePercent: 150 },
      food: {},
      consumption: {},
    });
    expect(result.success).toBe(false);
  });

  it('requires a household size of at least 1', () => {
    const result = footprintInputSchema.safeParse({
      region: 'GLOBAL',
      transport: {},
      home: { householdSize: 0 },
      food: {},
      consumption: {},
    });
    expect(result.success).toBe(false);
  });
});

describe('goalSchema', () => {
  it('accepts a valid goal', () => {
    const result = goalSchema.safeParse({
      targetTonnes: 2,
      baselineTonnes: 5,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a non-positive target', () => {
    const result = goalSchema.safeParse({
      targetTonnes: 0,
      baselineTonnes: 5,
      createdAt: '2026-01-01',
    });
    expect(result.success).toBe(false);
  });
});

describe('historySchema', () => {
  it('accepts an array of valid entries', () => {
    const result = historySchema.safeParse([{ date: '2026-01-01', totalKg: 1000, totalTonnes: 1 }]);
    expect(result.success).toBe(true);
  });

  it('rejects entries with the wrong shape', () => {
    const result = historySchema.safeParse([{ date: 5, totalKg: 'lots' }]);
    expect(result.success).toBe(false);
  });
});
