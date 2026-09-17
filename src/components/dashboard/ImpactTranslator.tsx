import { formatNumber, translateImpact } from '@/lib';
import { Card } from '@/components/ui';

export interface ImpactTranslatorProps {
  kgCo2e: number;
  heading?: string;
}

/** Makes an annual kg CO₂e estimate easier to relate to everyday activities. */
export function ImpactTranslator({
  kgCo2e,
  heading = 'What that means in everyday terms',
}: ImpactTranslatorProps) {
  const equivalent = translateImpact(kgCo2e);
  const items = [
    ['🌳', `≈ ${formatNumber(equivalent.treeYears, 0)} tree-years`, 'of carbon absorption'],
    ['🚗', `≈ ${formatNumber(equivalent.petrolDrivingKm, 0)} km`, 'of petrol driving'],
    ['✈️', `≈ ${formatNumber(equivalent.shortHaulFlights, 1)} short flights`, 'per passenger'],
  ];
  return (
    <section aria-labelledby="impact-heading">
      <Card className="bg-gradient-to-br from-primary/[0.08] via-white to-accent/[0.06]">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Impact translator
        </p>
        <h2 id="impact-heading" className="mt-1 font-display text-2xl font-bold text-ink">
          {heading}
        </h2>
        <p className="mt-2 text-sm text-ink/70">
          Your {formatNumber(kgCo2e, 0)} kg CO₂e annual estimate is roughly equivalent to:
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {items.map(([emoji, value, detail]) => (
            <li key={value} className="rounded-2xl bg-white/85 p-4 ring-1 ring-primary/10">
              <span className="text-2xl" aria-hidden="true">
                {emoji}
              </span>
              <p className="mt-2 font-display text-xl font-bold text-ink">{value}</p>
              <p className="mt-1 text-sm text-ink/60">{detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-ink/50">
          Equivalents are illustrative estimates based on EcoTrack&apos;s petrol and flight factors
          and an assumed 60 kg CO₂e absorbed per tree-year.
        </p>
      </Card>
    </section>
  );
}
