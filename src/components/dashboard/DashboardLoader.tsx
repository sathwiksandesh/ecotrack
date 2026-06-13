'use client';

import { useEffect, useState } from 'react';
import { loadHistory, loadInput, type FootprintInput, type HistoryEntry } from '@/lib';
import { ButtonLink, Card, Icon } from '@/components/ui';
import { DashboardView } from './DashboardView';

type State =
  | { phase: 'loading' }
  | { phase: 'empty' }
  | { phase: 'ready'; input: FootprintInput; history: HistoryEntry[] };

/**
 * Client shell for the dashboard. Reads the saved answers and history from
 * localStorage after mount (kept out of the initial render to avoid an SSR
 * hydration mismatch), then hands the pure {@link DashboardView} its props. If
 * nothing has been calculated yet, it nudges the visitor to the calculator.
 */
export function DashboardLoader() {
  const [state, setState] = useState<State>({ phase: 'loading' });

  useEffect(() => {
    const input = loadInput();
    if (!input) {
      setState({ phase: 'empty' });
      return;
    }
    setState({ phase: 'ready', input, history: loadHistory() });
  }, []);

  if (state.phase === 'loading') {
    return (
      <div className="flex flex-col gap-6" aria-hidden="true">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="h-32 animate-pulse bg-primary/5" />
          <Card className="h-32 animate-pulse bg-primary/5" />
          <Card className="h-32 animate-pulse bg-primary/5" />
        </div>
        <Card className="h-64 animate-pulse bg-primary/5" />
      </div>
    );
  }

  if (state.phase === 'empty') {
    return (
      <Card className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon name="leaf" size={28} />
        </span>
        <h2 className="font-display text-2xl font-bold text-ink">No results yet</h2>
        <p className="max-w-md text-ink/70">
          Answer the short questionnaire and your footprint, comparisons, and reduction tips will
          appear here.
        </p>
        <ButtonLink href="/calculator" size="lg">
          Start the calculator
          <Icon name="arrow-right" size={18} />
        </ButtonLink>
      </Card>
    );
  }

  return <DashboardView input={state.input} history={state.history} />;
}
