'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { calculateFootprint, formatTonnes, loadInput, type FootprintInput } from '@/lib';
import { Card, Icon } from '@/components/ui';

const WEEKS_PER_MONTH = 52 / 12;
const MEAT_MEALS: Record<FootprintInput['food']['diet'], number> = {
  vegan: 0,
  vegetarian: 0,
  pescatarian: 4,
  low_meat: 6,
  medium_meat: 12,
  high_meat: 20,
};

function Slider({
  id,
  label,
  current,
  value,
  max,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  current: number;
  value: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-semibold text-ink">{label}</h3>
          <p className="mt-1 text-sm text-ink/60">
            Current: {Math.round(current).toLocaleString('en-US')} {unit}
          </p>
        </div>
        <p className="font-display text-xl font-bold text-primary">
          Change: {Math.round(value).toLocaleString('en-US')} {unit}
        </p>
      </div>
      <input
        id={id}
        aria-label={label}
        type="range"
        min="0"
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-5 h-2 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

export function WhatIfSimulator() {
  const [input, setInput] = useState<FootprintInput | null>(null);
  const [carKm, setCarKm] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [meatMeals, setMeatMeals] = useState(0);
  useEffect(() => {
    const saved = loadInput();
    if (!saved) return;
    setInput(saved);
    setCarKm(Math.round(saved.transport.carKmPerWeek * WEEKS_PER_MONTH));
    setElectricity(saved.home.electricityKwhPerMonth);
    setMeatMeals(MEAT_MEALS[saved.food.diet]);
  }, []);
  const scenario = useMemo(() => {
    if (!input) return null;
    const current = calculateFootprint(input);
    const updated = calculateFootprint({
      ...input,
      transport: { ...input.transport, carKmPerWeek: carKm / WEEKS_PER_MONTH },
      home: { ...input.home, electricityKwhPerMonth: electricity },
    });
    const multiplier =
      input.food.foodWaste === 'high' ? 1.25 : input.food.foodWaste === 'medium' ? 1.1 : 1;
    const adjustedFoodKg = (1100 + meatMeals * 125) * multiplier;
    const afterKg = Math.max(0, updated.totalKg - current.categories.food + adjustedFoodKg);
    return {
      currentKg: current.totalKg,
      afterKg,
      savingKg: Math.max(0, current.totalKg - afterKg),
    };
  }, [carKm, electricity, input, meatMeals]);
  if (!input || !scenario)
    return (
      <Card className="text-center">
        <p className="text-ink/70">Create a footprint first to explore changes.</p>
        <Link
          href="/calculator"
          className="mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-white"
        >
          Start calculator
        </Link>
      </Card>
    );
  const carCurrent = input.transport.carKmPerWeek * WEEKS_PER_MONTH;
  const meatCurrent = MEAT_MEALS[input.food.diet];
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <Icon name="spark" size={22} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Scenario planner
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">🌱 What If?</h1>
            <p className="mt-2 max-w-2xl text-ink/70">
              Adjust habits to see an instant annual CO₂e estimate. Your saved dashboard data is not
              changed.
            </p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Slider
          id="car"
          label="🚗 Car travel"
          current={carCurrent}
          value={carKm}
          max={Math.max(1000, Math.ceil(carCurrent * 2))}
          unit="km/month"
          onChange={setCarKm}
        />
        <Slider
          id="electricity"
          label="⚡ Electricity"
          current={input.home.electricityKwhPerMonth}
          value={electricity}
          max={Math.max(500, Math.ceil(input.home.electricityKwhPerMonth * 2))}
          unit="kWh/month"
          onChange={setElectricity}
        />
        <Slider
          id="meat"
          label="🥩 Meat meals"
          current={meatCurrent}
          value={meatMeals}
          max={30}
          unit="/month"
          onChange={setMeatMeals}
        />
      </div>
      <Card className="bg-gradient-to-br from-primary/[0.08] via-white to-accent/[0.08]">
        <div className="grid items-center gap-6 text-center md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/55">Current</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink">
              {formatTonnes(scenario.currentKg / 1000)}
            </p>
            <p className="text-sm text-ink/60">CO₂/year</p>
          </div>
          <Icon
            name="arrow-right"
            size={28}
            className="mx-auto rotate-90 text-primary md:rotate-0"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              After changes
            </p>
            <p className="mt-2 font-display text-4xl font-bold text-primary">
              {formatTonnes(scenario.afterKg / 1000)}
            </p>
            <p className="text-sm text-ink/60">CO₂/year</p>
          </div>
        </div>
        <div className="mt-7 border-t border-primary/15 pt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Potential saving
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-accent">
            {formatTonnes(scenario.savingKg / 1000)}
          </p>
          <p className="text-sm text-ink/60">CO₂/year</p>
        </div>
        <p className="mt-5 text-center text-xs text-ink/55">
          Meat-meal changes use a proportional food-emissions estimate; all other changes use your
          selected calculator factors.
        </p>
      </Card>
    </div>
  );
}
