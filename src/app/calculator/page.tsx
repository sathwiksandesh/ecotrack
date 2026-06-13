import type { Metadata } from 'next';
import { CalculatorForm } from '@/components/calculator/CalculatorForm';
import { ErrorBoundary } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Calculator — EcoTrack AI',
  description:
    'Answer a short six-step questionnaire to estimate your annual carbon footprint across transport, home energy, food, and shopping.',
};

/**
 * Calculator route. A thin Server Component shell around the interactive client
 * form, so only the form code ships as client JS. Wrapped in an ErrorBoundary
 * for graceful recovery from unexpected render errors.
 */
export default function CalculatorPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Estimate your footprint
        </h1>
        <p className="mt-2 text-ink/70">
          A few quick questions. Your answers stay on this device, and you can refine them any
          time.
        </p>
      </header>
      <ErrorBoundary>
        <CalculatorForm />
      </ErrorBoundary>
    </main>
  );
}
