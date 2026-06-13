import type { Goal } from './schemas';
import { round } from './math';

export interface GoalProgress {
  /** Tonnes reduced from baseline so far (clamped at 0). */
  reducedTonnes: number;
  /** Total reduction the goal requires (baseline − target, clamped at 0). */
  neededTonnes: number;
  /** Progress toward the target, 0–100. */
  progressPercent: number;
  /** Tonnes still to cut to reach the target (0 once achieved). */
  remainingTonnes: number;
  /** True once the current footprint is at or below the target. */
  achieved: boolean;
}

/**
 * Compute progress of a current footprint against a reduction goal.
 *
 * Pure and defensive: if the goal's baseline is not above its target (nothing to
 * reduce), progress is reported as already complete. Values are clamped so the UI
 * never shows negative reductions or progress beyond 100%.
 */
export function goalProgress(goal: Goal, currentTonnes: number): GoalProgress {
  const needed = goal.baselineTonnes - goal.targetTonnes;
  const reduced = Math.max(0, goal.baselineTonnes - currentTonnes);
  const achieved = currentTonnes <= goal.targetTonnes;

  const progressPercent =
    needed <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((reduced / needed) * 100)));
  const remaining = achieved ? 0 : Math.max(0, currentTonnes - goal.targetTonnes);

  return {
    reducedTonnes: round(reduced),
    neededTonnes: round(Math.max(0, needed)),
    progressPercent,
    remainingTonnes: round(remaining),
    achieved,
  };
}
