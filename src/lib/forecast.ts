import { calculateFootprint } from './calculator';
import { generateTips } from './tips-engine';
import type { FootprintInput, HistoryEntry } from './schemas';

const SIX_MONTHS_DAYS = 183;

export interface FootprintForecast {
  currentKg: number;
  withoutChangesKg: number;
  withRecommendedChangesKg: number;
  dataPoints: number;
  dailyTrendKg: number;
}

/** Projects the current footprint from saved history and models top actions. */
export function forecastSixMonths(
  input: FootprintInput,
  history: HistoryEntry[],
): FootprintForecast {
  const current = calculateFootprint(input);
  const dated = history
    .map((entry) => ({ ...entry, timestamp: new Date(entry.date).getTime() }))
    .filter((entry) => Number.isFinite(entry.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);
  const first = dated[0];
  const last = dated[dated.length - 1];
  const elapsedDays =
    first && last && last.timestamp > first.timestamp
      ? (last.timestamp - first.timestamp) / 86_400_000
      : 0;
  const dailyTrendKg =
    first && last && elapsedDays > 0 ? (last.totalKg - first.totalKg) / elapsedDays : 0;
  const withoutChangesKg = Math.max(0, current.totalKg + dailyTrendKg * SIX_MONTHS_DAYS);
  const recommendedSavingsKg = generateTips(input, current, { limit: 3 }).reduce(
    (total, tip) => total + tip.estimatedSavingKg,
    0,
  );
  return {
    currentKg: current.totalKg,
    withoutChangesKg,
    withRecommendedChangesKg: Math.max(0, withoutChangesKg - recommendedSavingsKg),
    dataPoints: dated.length,
    dailyTrendKg,
  };
}
