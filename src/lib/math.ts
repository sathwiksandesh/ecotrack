/**
 * Shared numeric utility for EcoTrack AI domain logic.
 *
 * Extracted from the individual modules that previously each defined their own
 * `round` helper, ensuring a single, tested implementation across the codebase.
 */

/**
 * Round a number to a given number of decimal places.
 *
 * Uses the "round half away from zero" strategy via `Math.round` on a scaled
 * value, which is appropriate for display-oriented CO₂e figures where
 * sub-cent floating-point noise should not appear in the output.
 *
 * @param n       The value to round.
 * @param places  Decimal places to keep (default 2).
 */
export function round(n: number, places = 2): number {
  const factor = 10 ** places;
  return Math.round(n * factor) / factor;
}
