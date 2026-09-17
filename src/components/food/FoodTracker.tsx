'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatCo2, formatNumber } from '@/lib';
import { Button, Card, Icon } from '@/components/ui';

const STORAGE_KEY = 'ecotrack-ai:food-today';
const FACTORS = { meat: 1.2, dairy: 0.35, vegetables: 0.08, grains: 0.12 } as const;
type FoodKey = keyof typeof FACTORS;
type Meals = Record<FoodKey, number>;
const DEFAULT_MEALS: Meals = { meat: 2, dairy: 3, vegetables: 4, grains: 3 };
const FOODS: Array<{ key: FoodKey; emoji: string; label: string; unit: string }> = [
  { key: 'meat', emoji: '🥩', label: 'Meat', unit: 'meals' },
  { key: 'dairy', emoji: '🥛', label: 'Dairy', unit: 'servings' },
  { key: 'vegetables', emoji: '🥗', label: 'Vegetables', unit: 'servings' },
  { key: 'grains', emoji: '🌾', label: 'Grains', unit: 'servings' },
];

/** Daily food log with transparent, approximate CO₂e factors. */
export function FoodTracker() {
  const [meals, setMeals] = useState<Meals>(DEFAULT_MEALS);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = globalThis.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: unknown = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        const candidate = saved as Partial<Meals>;
        setMeals({
          meat:
            typeof candidate.meat === 'number' && candidate.meat >= 0
              ? candidate.meat
              : DEFAULT_MEALS.meat,
          dairy:
            typeof candidate.dairy === 'number' && candidate.dairy >= 0
              ? candidate.dairy
              : DEFAULT_MEALS.dairy,
          vegetables:
            typeof candidate.vegetables === 'number' && candidate.vegetables >= 0
              ? candidate.vegetables
              : DEFAULT_MEALS.vegetables,
          grains:
            typeof candidate.grains === 'number' && candidate.grains >= 0
              ? candidate.grains
              : DEFAULT_MEALS.grains,
        });
      }
    } catch {
      /* Local storage is optional. */
    } finally {
      setHydrated(true);
    }
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
    } catch {
      /* Local storage is optional. */
    }
  }, [hydrated, meals]);
  const footprintKg = useMemo(
    () => FOODS.reduce((total, food) => total + meals[food.key] * FACTORS[food.key], 0),
    [meals],
  );
  const annualSavingKg = Math.max(0, (FACTORS.meat - 0.2) * 2 * 52);
  function update(key: FoodKey, value: number) {
    setMeals((previous) => ({ ...previous, [key]: Math.max(0, Math.min(20, value)) }));
  }
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="bg-gradient-to-br from-secondary/[0.12] via-white to-primary/[0.06]">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/20 text-2xl">
            🥗
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Daily log
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">Today&apos;s Food</h1>
            <p className="mt-2 text-ink/70">
              Track today&apos;s meals and servings to understand their estimated climate impact.
            </p>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {FOODS.map((food) => (
            <div
              key={food.key}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/90 p-4 ring-1 ring-primary/10"
            >
              <div>
                <p className="text-lg font-semibold text-ink">
                  {food.emoji} {food.label}
                </p>
                <p className="text-sm text-ink/60">
                  {meals[food.key]} {food.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  aria-label={`Decrease ${food.label}`}
                  variant="secondary"
                  className="min-h-9 px-3 py-1"
                  onClick={() => update(food.key, meals[food.key] - 1)}
                >
                  −
                </Button>
                <Button
                  aria-label={`Increase ${food.label}`}
                  variant="secondary"
                  className="min-h-9 px-3 py-1"
                  onClick={() => update(food.key, meals[food.key] + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-7 rounded-2xl bg-primary p-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Food footprint
          </p>
          <p className="mt-2 font-display text-4xl font-bold">{formatCo2(footprintKg)}</p>
          <p className="mt-1 text-sm text-white/75">for today</p>
        </div>
        <div className="mt-5 flex gap-3 rounded-2xl border border-secondary/25 bg-secondary/[0.08] p-5">
          <Icon name="spark" size={20} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-ink/75">
            Replacing 2 meat meals/week with lower-emission alternatives could reduce your estimated
            annual footprint by{' '}
            <span className="font-semibold text-primary">
              {formatNumber(annualSavingKg)} kg CO₂e
            </span>
            .
          </p>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink/50">
          Approximate factors per serving: meat 1.2 kg, dairy 0.35 kg, vegetables 0.08 kg, grains
          0.12 kg CO₂e. The recommendation assumes a 0.2 kg CO₂e lower-emission meal.
        </p>
      </Card>
    </div>
  );
}
