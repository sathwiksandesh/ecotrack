import type { Metadata } from 'next';
import { FoodTracker } from '@/components/food/FoodTracker';

export const metadata: Metadata = {
  title: 'Food Tracker — EcoTrack AI',
  description: 'Track the estimated footprint of today’s food.',
};

export default function FoodTrackerPage() {
  return (
    <main id="main" className="px-4 py-12 sm:px-6">
      <FoodTracker />
    </main>
  );
}
