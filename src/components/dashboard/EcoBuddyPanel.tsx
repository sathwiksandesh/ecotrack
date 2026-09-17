'use client';

import { useState } from 'react';
import type { FootprintInput, HistoryEntry } from '@/lib';
import { answerEcoBuddyQuestion } from '@/lib';
import { Button, Card, Icon } from '@/components/ui';

const EXAMPLES = [
  'Why is my footprint high?',
  'What can I change this week?',
  'If I stop using my car 2 days a week, how much CO₂ will I save?',
  'Give me a ₹500/month sustainability plan.',
];

interface EcoBuddyPanelProps {
  input: FootprintInput;
  history: HistoryEntry[];
}

/** A local, data-grounded Q/A surface for the saved dashboard profile. */
export function EcoBuddyPanel({ input, history }: EcoBuddyPanelProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<ReturnType<typeof answerEcoBuddyQuestion> | null>(null);
  function ask(nextQuestion = question) {
    const trimmed = nextQuestion.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setResponse(answerEcoBuddyQuestion(trimmed, input, history));
  }
  return (
    <section aria-labelledby="ecobuddy-heading">
      <Card className="overflow-hidden bg-gradient-to-br from-primary/[0.08] via-white to-secondary/[0.08]">
        <div className="flex items-start gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl shadow-glow-sm"
            aria-hidden="true"
          >
            🌱
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Personalized Q&amp;A
            </p>
            <h2 id="ecobuddy-heading" className="mt-1 font-display text-2xl font-bold text-ink">
              Ask EcoBuddy 🌱
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
              Ask about your footprint, habits, or a change you&apos;re considering. Answers use
              your saved dashboard data and EcoTrack&apos;s calculation assumptions.
            </p>
          </div>
        </div>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            ask();
          }}
        >
          <label className="sr-only" htmlFor="ecobuddy-question">
            Your sustainability question
          </label>
          <input
            id="ecobuddy-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. Which category is my biggest contributor?"
            className="min-h-[48px] flex-1 rounded-2xl border border-primary/20 bg-white px-4 text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button type="submit" className="shrink-0">
            <Icon name="spark" size={18} /> Ask EcoBuddy
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Example questions">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => ask(example)}
              className="rounded-full bg-white px-3 py-2 text-left text-xs font-medium text-primary ring-1 ring-primary/15 transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {example}
            </button>
          ))}
        </div>
        {response ? (
          <div
            className="mt-6 rounded-2xl border border-primary/15 bg-white/90 p-4"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold text-ink">EcoBuddy</p>
            <p className="mt-1 leading-relaxed text-ink/80">{response.answer}</p>
            {response.note ? (
              <p className="mt-3 text-xs leading-relaxed text-ink/55">{response.note}</p>
            ) : null}
          </div>
        ) : null}
      </Card>
    </section>
  );
}
