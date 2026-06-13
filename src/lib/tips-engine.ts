import {
  CAR_FUEL_FACTOR,
  FLIGHT_FACTOR,
  TRANSIT_FACTOR,
  DIET_FACTOR,
  FOOD_WASTE_MULTIPLIER,
  SHOPPING_FACTOR,
  RECYCLING_MULTIPLIER,
  WEEKS_PER_YEAR,
} from './emission-factors';
import type { Diet, Shopping } from './emission-factors';
import type { CategoryKey, FootprintInput, FootprintResult } from './schemas';
import { round } from './math';

export type Effort = 'low' | 'medium' | 'high';

export interface Tip {
  id: string;
  category: CategoryKey;
  title: string;
  description: string;
  /** Estimated annual saving from this single action, kg CO₂e. */
  estimatedSavingKg: number;
  effort: Effort;
}

/** The next lower-impact diet for each diet (null for the lowest). */
const LOWER_IMPACT_DIET: Record<Diet, Diet | null> = {
  high_meat: 'medium_meat',
  medium_meat: 'low_meat',
  low_meat: 'pescatarian',
  pescatarian: 'vegetarian',
  vegetarian: 'vegan',
  vegan: null,
};

/**
 * Human-readable label for a diet key, matching the presentation labels used
 * in the UI (e.g. "medium meat" instead of "medium_meat").
 */
function humanizeDiet(diet: Diet): string {
  return diet.replace('_', ' ');
}

export interface GenerateTipsOptions {
  /** Maximum number of tips to return (highest-impact first). */
  limit?: number;
}

/**
 * Produce a ranked list of personalized reduction tips.
 *
 * Rule-based and deterministic: each tip's estimated saving is derived from the
 * same emission factors used by the calculator, so the numbers are internally
 * consistent. Tips are sorted by estimated saving, descending.
 *
 * @param input   The validated footprint questionnaire answers.
 * @param result  The calculated footprint (must correspond to `input`).
 * @param options Optional configuration; `limit` caps the returned list length.
 */
export function generateTips(
  input: FootprintInput,
  result: FootprintResult,
  options: GenerateTipsOptions = {},
): Tip[] {
  const tips: Tip[] = [];
  const { transport, home, food, consumption } = input;

  // 1. Switch the car toward electric.
  if (transport.carFuel !== 'electric' && transport.carFuel !== 'none' && result.details.car > 0) {
    const km = transport.carKmPerWeek * WEEKS_PER_YEAR;
    const saving = km * (CAR_FUEL_FACTOR[transport.carFuel] - CAR_FUEL_FACTOR.electric);
    tips.push({
      id: 'switch-ev',
      category: 'transport',
      title: 'Switch to an electric vehicle',
      description:
        'Replacing your current car with an EV removes most of its direct driving emissions.',
      estimatedSavingKg: round(saving),
      effort: 'high',
    });
  }

  // 2. Replace one long-haul flight.
  if (transport.flightsLongHaulPerYear >= 1) {
    tips.push({
      id: 'cut-longhaul-flight',
      category: 'transport',
      title: 'Replace one long-haul flight',
      description:
        'Swapping a single long-haul return trip for rail, a closer destination, or a virtual meeting.',
      estimatedSavingKg: round(FLIGHT_FACTOR.longHaul),
      effort: 'medium',
    });
  }

  // 3. Shift some car trips to transit / active travel.
  if (result.details.car > 500 && transport.publicTransitKmPerWeek < transport.carKmPerWeek) {
    const shiftedKm = transport.carKmPerWeek * 0.25 * WEEKS_PER_YEAR;
    const saving = shiftedKm * (CAR_FUEL_FACTOR[transport.carFuel] - TRANSIT_FACTOR);
    if (saving > 0) {
      tips.push({
        id: 'shift-to-transit',
        category: 'transport',
        title: 'Shift a quarter of car trips to transit or cycling',
        description:
          'Moving short, regular journeys from the car to public transport, walking, or cycling.',
        estimatedSavingKg: round(saving),
        effort: 'medium',
      });
    }
  }

  // 4. Switch to a renewable electricity tariff.
  if (home.renewablePercent < 100 && result.details.electricity > 0) {
    const saving = result.details.electricity * (1 - home.renewablePercent / 100);
    tips.push({
      id: 'renewable-tariff',
      category: 'home',
      title: 'Switch to a renewable electricity tariff',
      description:
        'A certified green tariff or rooftop solar can cut your electricity emissions toward zero.',
      estimatedSavingKg: round(saving),
      effort: 'low',
    });
  }

  // 5. Shift toward a lower-impact diet.
  const lower = LOWER_IMPACT_DIET[food.diet];
  if (lower) {
    const saving =
      (DIET_FACTOR[food.diet] - DIET_FACTOR[lower]) * FOOD_WASTE_MULTIPLIER[food.foodWaste];
    if (saving > 0) {
      tips.push({
        id: 'diet-shift',
        category: 'food',
        title: 'Shift toward a lower-impact diet',
        description: `Moving from a ${humanizeDiet(food.diet)} to a ${humanizeDiet(lower)} diet meaningfully lowers food emissions.`,
        estimatedSavingKg: round(saving),
        effort: 'medium',
      });
    }
  }

  // 6. Cut food waste.
  if (food.foodWaste !== 'low') {
    const current = DIET_FACTOR[food.diet] * FOOD_WASTE_MULTIPLIER[food.foodWaste];
    const reduced = DIET_FACTOR[food.diet] * FOOD_WASTE_MULTIPLIER.low;
    tips.push({
      id: 'cut-food-waste',
      category: 'food',
      title: 'Reduce food waste',
      description:
        'Planning meals and storing food well cuts the emissions embedded in food that gets thrown away.',
      estimatedSavingKg: round(current - reduced),
      effort: 'low',
    });
  }

  // 7. Buy less and choose secondhand.
  if (consumption.shopping !== 'minimal') {
    const reducedLevel: Shopping = consumption.shopping === 'frequent' ? 'average' : 'minimal';
    const multiplier = consumption.recycles ? RECYCLING_MULTIPLIER : 1;
    const saving =
      (SHOPPING_FACTOR[consumption.shopping] - SHOPPING_FACTOR[reducedLevel]) * multiplier;
    tips.push({
      id: 'buy-less',
      category: 'consumption',
      title: 'Buy less and choose secondhand',
      description:
        'Extending the life of what you own and buying used avoids the emissions of new products.',
      estimatedSavingKg: round(saving),
      effort: 'medium',
    });
  }

  // 8. Recycle consistently.
  if (!consumption.recycles) {
    const saving = SHOPPING_FACTOR[consumption.shopping] * (1 - RECYCLING_MULTIPLIER);
    tips.push({
      id: 'start-recycling',
      category: 'consumption',
      title: 'Recycle consistently',
      description: 'Routine recycling lowers the lifecycle emissions of your household goods.',
      estimatedSavingKg: round(saving),
      effort: 'low',
    });
  }

  tips.sort((a, b) => b.estimatedSavingKg - a.estimatedSavingKg);

  const limit = options.limit ?? tips.length;
  return tips.slice(0, Math.max(0, limit));
}
