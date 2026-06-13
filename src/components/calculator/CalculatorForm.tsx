'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addHistoryEntry,
  calculateFootprint,
  consumptionInputSchema,
  defaultFootprintInput,
  foodInputSchema,
  footprintInputSchema,
  homeInputSchema,
  loadInput,
  saveInput,
  transportInputSchema,
  type FootprintInput,
  type Region,
} from '@/lib';
import { Button, Card, Icon, Stepper } from '@/components/ui';
import { RegionStep } from './steps/RegionStep';
import { TransportStep } from './steps/TransportStep';
import { HomeStep } from './steps/HomeStep';
import { FoodStep } from './steps/FoodStep';
import { ConsumptionStep } from './steps/ConsumptionStep';
import { ReviewStep } from './steps/ReviewStep';
import { validateStep, type FieldErrors } from './validation';
import type { z } from 'zod';

const STEP_LABELS = ['Region', 'Transport', 'Home', 'Food', 'Shopping', 'Review'] as const;
type StepLabel = (typeof STEP_LABELS)[number];
const LAST_STEP = STEP_LABELS.length - 1;

/**
 * Maps each numeric step index to the Zod schema that validates it and a
 * function to extract the slice of `FootprintInput` to validate. Using a lookup
 * table instead of a switch removes the need for exhaustiveness tracking and
 * makes adding or reordering steps a single-site change.
 */
const STEP_VALIDATORS: ReadonlyArray<
  | { schema: z.ZodTypeAny; getValue: (input: FootprintInput) => unknown }
  | null // null = review step, no per-step validation needed
> = [
  { schema: footprintInputSchema.shape.region, getValue: (i) => i.region },
  { schema: transportInputSchema, getValue: (i) => i.transport },
  { schema: homeInputSchema, getValue: (i) => i.home },
  { schema: foodInputSchema, getValue: (i) => i.food },
  { schema: consumptionInputSchema, getValue: (i) => i.consumption },
  null, // review
];

/**
 * Multi-step questionnaire. Holds the full `FootprintInput` in local state,
 * seeded from `loadInput()` after mount (kept out of the initial render to
 * avoid an SSR hydration mismatch). Each step is validated against its slice
 * of the Zod schema before advancing; the final submit validates the whole
 * thing, persists it, records a history point, and routes to the dashboard.
 */
export function CalculatorForm() {
  const router = useRouter();
  const [input, setInput] = useState<FootprintInput>(defaultFootprintInput);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Seed from previously saved answers once, on the client only.
  useEffect(() => {
    const saved = loadInput();
    if (saved) setInput(saved);
  }, []);

  // Move focus to the step heading on each step change for keyboard/SR users.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = (patch: Partial<FootprintInput>) => setInput((prev) => ({ ...prev, ...patch }));

  function validateCurrent(): boolean {
    const validator = STEP_VALIDATORS[step];
    if (!validator) {
      // Review step — nothing to validate independently.
      return true;
    }

    const result = validateStep(validator.schema, validator.getValue(input));
    if (result.ok) {
      setErrors({});
      return true;
    }

    // For the region step the path is empty, so map the root error onto `region`.
    const fieldErrors =
      step === 0
        ? { region: Object.values(result.errors)[0] ?? 'Please choose an option.' }
        : result.errors;

    setErrors(fieldErrors);
    setStatus('Please fix the highlighted fields before continuing.');
    return false;
  }

  function handleNext() {
    if (!validateCurrent()) return;
    setStatus('');
    setStep((s) => Math.min(s + 1, LAST_STEP));
  }

  function handleBack() {
    setErrors({});
    setStatus('');
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    const result = validateStep(footprintInputSchema, input);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus('Some answers are invalid. Please review the earlier steps.');
      return;
    }
    const valid = result.data;
    saveInput(valid);
    const footprint = calculateFootprint(valid);
    addHistoryEntry({
      date: new Date().toISOString(),
      totalKg: footprint.totalKg,
      totalTonnes: footprint.totalTonnes,
    });
    router.push('/dashboard');
  }

  const stepLabel: StepLabel = STEP_LABELS[step] ?? STEP_LABELS[0];

  return (
    <div className="flex flex-col gap-8">
      <Stepper steps={STEP_LABELS} current={step} />

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === LAST_STEP) handleSubmit();
            else handleNext();
          }}
          noValidate
        >
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl font-bold text-ink focus:outline-none"
          >
            {stepLabel === 'Review' ? 'Review your answers' : stepLabel}
          </h2>
          <p className="mt-1 text-ink/60">
            Step {step + 1} of {STEP_LABELS.length}
          </p>

          <div className="mt-6">
            {step === 0 && (
              <RegionStep
                value={input.region}
                errors={errors}
                onChange={(region: Region) => update({ region })}
              />
            )}
            {step === 1 && (
              <TransportStep
                value={input.transport}
                errors={errors}
                onChange={(patch) => update({ transport: { ...input.transport, ...patch } })}
              />
            )}
            {step === 2 && (
              <HomeStep
                value={input.home}
                errors={errors}
                onChange={(patch) => update({ home: { ...input.home, ...patch } })}
              />
            )}
            {step === 3 && (
              <FoodStep
                value={input.food}
                errors={errors}
                onChange={(patch) => update({ food: { ...input.food, ...patch } })}
              />
            )}
            {step === 4 && (
              <ConsumptionStep
                value={input.consumption}
                errors={errors}
                onChange={(patch) =>
                  update({ consumption: { ...input.consumption, ...patch } })
                }
              />
            )}
            {step === LAST_STEP && <ReviewStep input={input} />}
          </div>

          {/* Polite live region announces validation problems / step status. */}
          <p aria-live="polite" className="sr-only">
            {status}
          </p>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 0}>
              <Icon name="arrow-left" size={18} />
              Back
            </Button>
            {step === LAST_STEP ? (
              <Button type="submit" size="lg" variant="accent">
                See my results
                <Icon name="arrow-right" size={18} />
              </Button>
            ) : (
              <Button type="submit" size="lg">
                Continue
                <Icon name="arrow-right" size={18} />
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
