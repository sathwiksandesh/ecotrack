import type { z } from 'zod';
import type { FootprintInput } from '@/lib';

/** Per-section slices of the full input, derived from the engine's own type. */
export type TransportInput = FootprintInput['transport'];
export type HomeInput = FootprintInput['home'];
export type FoodInput = FootprintInput['food'];
export type ConsumptionInput = FootprintInput['consumption'];

/** Field-keyed error messages for a single step. */
export type FieldErrors = Record<string, string>;

/**
 * Collapse a Zod error into a flat `{ fieldName: firstMessage }` map keyed by the
 * top-level path segment, which is what each step's controls look up. Keeping only
 * the first message per field matches what we surface in the UI.
 */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : '_root';
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Validate a value against a schema, returning typed data or field errors. */
export function validateStep<S extends z.ZodTypeAny>(
  schema: S,
  value: unknown,
): { ok: true; data: z.infer<S> } | { ok: false; errors: FieldErrors } {
  const result = schema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, errors: toFieldErrors(result.error) };
}
