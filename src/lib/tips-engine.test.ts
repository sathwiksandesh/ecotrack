import { describe, expect, it } from 'vitest';
import { generateTips } from './tips-engine';
import { calculateFootprint } from './calculator';
import { footprintInputSchema, type FootprintInput } from './schemas';

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

const heavyInput = build({
  transport: { carKmPerWeek: 150, carFuel: 'petrol', flightsLongHaulPerYear: 1 },
  home: { electricityKwhPerMonth: 400, heatingFuel: 'gas', heatingAmountPerMonth: 80 },
  food: { diet: 'high_meat', foodWaste: 'high' },
  consumption: { shopping: 'frequent', recycles: false },
});

describe('generateTips', () => {
  it('returns tips with positive estimated savings', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    expect(tips.length).toBeGreaterThan(0);
    expect(tips.every((t) => t.estimatedSavingKg > 0)).toBe(true);
  });

  it('is sorted by estimated saving, descending', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    const savings = tips.map((t) => t.estimatedSavingKg);
    const sorted = [...savings].sort((a, b) => b - a);
    expect(savings).toEqual(sorted);
  });

  it('recommends a diet shift for a high-meat eater with the expected saving', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    const dietTip = tips.find((t) => t.id === 'diet-shift');
    expect(dietTip).toBeDefined();
    // (3600 - 2800) * 1.25 = 1000
    expect(dietTip?.estimatedSavingKg).toBeCloseTo(1000);
  });

  it('recommends switching to an EV for a petrol driver', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput));
    expect(tips.some((t) => t.id === 'switch-ev')).toBe(true);
  });

  it('respects the limit option', () => {
    const tips = generateTips(heavyInput, calculateFootprint(heavyInput), { limit: 2 });
    expect(tips).toHaveLength(2);
  });

  it('returns no tips for an already low-impact profile', () => {
    const greenInput = build({
      transport: {},
      home: {},
      food: { diet: 'vegan', foodWaste: 'low' },
      consumption: { shopping: 'minimal', recycles: true },
    });
    const tips = generateTips(greenInput, calculateFootprint(greenInput));
    expect(tips).toHaveLength(0);
  });
});
