'use client';

import { useEffect, useState } from 'react';
import {
  clearGoal,
  formatPercent,
  formatTonnes,
  goalProgress,
  loadGoal,
  saveGoal,
  TARGET_TONNES,
  type Goal,
} from '@/lib';
import { Button, Card, Icon, NumberField, ProgressBar } from '@/components/ui';

export interface GoalTrackerProps {
  /** Current annual footprint in tonnes, used as the baseline and for progress. */
  currentTonnes: number;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Set and track a reduction goal. The goal is persisted via the storage layer; its
 * baseline is captured from the footprint at the moment it's set, so progress is
 * measured against where you started, not the latest number.
 */
export function GoalTracker({ currentTonnes }: GoalTrackerProps) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loaded, setLoaded] = useState(false);
  const suggested = Math.max(TARGET_TONNES, round1(currentTonnes * 0.8));
  const [target, setTarget] = useState(suggested);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setGoal(loadGoal());
    setLoaded(true);
  }, []);

  function handleSet() {
    if (!Number.isFinite(target) || target <= 0) {
      setError('Enter a target greater than zero.');
      return;
    }
    if (target >= currentTonnes) {
      setError('Your target should be below your current footprint to be a reduction.');
      return;
    }
    const next: Goal = {
      targetTonnes: round1(target),
      baselineTonnes: round1(currentTonnes),
      createdAt: new Date().toISOString(),
    };
    saveGoal(next);
    setGoal(next);
    setError(undefined);
  }

  function handleClear() {
    clearGoal();
    setGoal(null);
    setTarget(suggested);
  }

  if (!loaded) {
    // Avoid an SSR/CSR mismatch: render nothing definitive until the goal is read.
    return <Card className="h-40 animate-pulse bg-primary/5" aria-hidden="true" />;
  }

  if (!goal) {
    return (
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary-dark">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="target" size={20} />
          </span>
          <h3 className="font-display text-lg font-semibold text-ink">Set a reduction goal</h3>
        </div>
        <p className="text-sm text-ink/70">
          Pick an annual target below your current {formatTonnes(currentTonnes)}. We&apos;ll track
          your progress as you recalculate over time.
        </p>
        <div className="max-w-xs">
          <NumberField
            label="Annual target"
            value={target}
            unit="t CO₂e"
            min={0}
            step={0.1}
            error={error}
            onChange={setTarget}
          />
        </div>
        <div>
          <Button onClick={handleSet}>
            <Icon name="check" size={18} />
            Set goal
          </Button>
        </div>
      </Card>
    );
  }

  const progress = goalProgress(goal, currentTonnes);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-primary-dark">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="target" size={20} />
          </span>
          <h3 className="font-display text-lg font-semibold text-ink">Your reduction goal</h3>
        </div>
        <Button variant="ghost" size="md" onClick={handleClear}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-2xl bg-surface p-3">
          <p className="text-xs uppercase tracking-wide text-ink/60">Baseline</p>
          <p className="font-display text-lg font-bold text-ink">
            {formatTonnes(goal.baselineTonnes)}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-3">
          <p className="text-xs uppercase tracking-wide text-ink/60">Now</p>
          <p className="font-display text-lg font-bold text-ink">{formatTonnes(currentTonnes)}</p>
        </div>
        <div className="rounded-2xl bg-surface p-3">
          <p className="text-xs uppercase tracking-wide text-ink/60">Target</p>
          <p className="font-display text-lg font-bold text-ink">
            {formatTonnes(goal.targetTonnes)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ProgressBar
          value={progress.progressPercent}
          label="Progress toward your reduction goal"
          valueText={`${formatPercent(progress.progressPercent)} of the way from baseline to target`}
          tone={progress.achieved ? 'primary' : 'accent'}
        />
        <p aria-live="polite" className="text-sm font-medium text-ink">
          {progress.achieved ? (
            <span className="inline-flex items-center gap-1 text-primary-dark">
              <Icon name="trophy" size={16} />
              Target reached — you&apos;ve cut {formatTonnes(progress.reducedTonnes)} from your
              baseline.
            </span>
          ) : (
            <>
              {formatPercent(progress.progressPercent)} there ·{' '}
              {formatTonnes(progress.remainingTonnes)} still to cut to reach your target.
            </>
          )}
        </p>
      </div>
    </Card>
  );
}
