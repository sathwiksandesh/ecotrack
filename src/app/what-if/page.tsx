import type { Metadata } from 'next';
import { WhatIfSimulator } from '@/components/what-if/WhatIfSimulator';

export const metadata: Metadata = {
  title: 'What If? — EcoTrack AI',
  description: 'Explore how changing everyday habits affects your footprint.',
};

export default function WhatIfPage() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <WhatIfSimulator />
    </main>
  );
}
