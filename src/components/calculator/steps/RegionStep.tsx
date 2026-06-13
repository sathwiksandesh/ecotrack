import { RadioGroup } from '@/components/ui';
import { REGIONS, type Region } from '@/lib';
import { REGION_LABELS } from '@/components/labels';
import type { FieldErrors } from '../validation';

const REGION_DESCRIPTIONS: Record<Region, string> = {
  US: 'High grid intensity; sets US benchmarks.',
  UK: 'Lower-carbon grid; UK benchmarks.',
  EU: 'EU-average grid and benchmarks.',
  IN: 'High grid intensity; India benchmarks.',
  GLOBAL: 'Use world averages if unsure.',
};

export interface RegionStepProps {
  value: Region;
  onChange: (region: Region) => void;
  errors: FieldErrors;
}

/** Step 1 — region drives grid intensity and the benchmarks used downstream. */
export function RegionStep({ value, onChange, errors }: RegionStepProps) {
  return (
    <RadioGroup
      legend="Where do you live?"
      hint="This sets your electricity grid intensity and the averages you're compared against."
      name="region"
      value={value}
      error={errors.region}
      onChange={onChange}
      options={REGIONS.map((r) => ({
        value: r,
        label: REGION_LABELS[r],
        description: REGION_DESCRIPTIONS[r],
      }))}
    />
  );
}
