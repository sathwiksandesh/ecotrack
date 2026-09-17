import { categoryBreakdown } from './breakdown';
import { calculateFootprint } from './calculator';
import { compareToAverage, compareToTarget } from './comparisons';
import { CAR_FUEL_FACTOR, DIET_FACTOR, TRANSIT_FACTOR, WEEKS_PER_YEAR } from './emission-factors';
import { formatCo2, formatPercent, formatTonnes } from './format';
import { generateTips } from './tips-engine';
import type { FootprintInput, HistoryEntry } from './schemas';

export interface EcoBuddyAnswer {
  answer: string;
  note?: string;
}

/** Answers only sustainability questions, using the same local data and factors as the dashboard. */
export function answerEcoBuddyQuestion(
  question: string,
  input: FootprintInput,
  history: HistoryEntry[] = [],
): EcoBuddyAnswer {
  const query = question.trim().toLowerCase();
  const result = calculateFootprint(input);
  const [largest] = categoryBreakdown(result);
  const top = generateTips(input, result, { limit: 1 })[0];
  const category =
    largest!.key === 'home'
      ? 'Home energy'
      : largest!.key === 'consumption'
        ? 'Shopping & goods'
        : largest!.key[0]!.toUpperCase() + largest!.key.slice(1);
  if (!query)
    return {
      answer: 'Ask a carbon-footprint question, and I’ll use your dashboard data to answer it.',
    };
  const terms = [
    'carbon',
    'co2',
    'co₂',
    'footprint',
    'emission',
    'sustain',
    'green',
    'transport',
    'car',
    'drive',
    'flight',
    'fly',
    'food',
    'meat',
    'vegetarian',
    'vegan',
    'electric',
    'energy',
    'electricity',
    'home',
    'solar',
    'shopping',
    'recycl',
    'waste',
    'goal',
    'net zero',
    'offset',
    'tree',
    'commute',
    'reduce',
    'change',
    'week',
    'impact',
    'save',
    'hybrid',
    'work from home',
    'beef',
    'scope',
    'plastic',
  ];
  if (!terms.some((term) => query.includes(term)))
    return {
      answer:
        'I’m EcoBuddy, so I only answer carbon-footprint and sustainability questions. Try asking which part of your footprint is largest or what change would save the most CO₂e.',
    };

  if (
    (query.includes('car') || query.includes('driv')) &&
    (query.includes('2 day') || query.includes('two day'))
  ) {
    const saving = Math.max(
      0,
      input.transport.carKmPerWeek *
        (2 / 7) *
        WEEKS_PER_YEAR *
        (CAR_FUEL_FACTOR[input.transport.carFuel] - TRANSIT_FACTOR),
    );
    return saving > 0
      ? {
          answer: `Replacing two days of your usual weekly car travel with public transport would save about ${formatCo2(saving)} per year. That is ${formatPercent((saving / result.totalKg) * 100, 1)} of your annual footprint.`,
          note: 'Estimate assumes two-sevenths of your weekly car distance moves to public transport.',
        }
      : {
          answer:
            'Your saved profile has no higher-emitting car travel to shift, so this change does not reduce the estimate.',
        };
  }

  if (['vegetarian', 'vegan', 'meat-free', 'meatless'].some((term) => query.includes(term))) {
    const targetDiet = query.includes('vegan') ? 'vegan' : 'vegetarian';
    const wasteMultiplier =
      input.food.foodWaste === 'high' ? 1.25 : input.food.foodWaste === 'medium' ? 1.1 : 1;
    const saving = Math.max(
      0,
      (DIET_FACTOR[input.food.diet] - DIET_FACTOR[targetDiet]) * wasteMultiplier * (3 / 7),
    );
    return saving > 0
      ? {
          answer: `Eating ${targetDiet} three days each week would lower your modelled food footprint by about ${formatCo2(saving)} per year. Food is currently ${formatPercent((result.categories.food / result.totalKg) * 100, 1)} of your total.`,
          note: 'This scales the modelled annual diet difference to three days per week; it is an estimate, not a nutrition assessment.',
        }
      : {
          answer:
            'Your recorded diet is already as low-impact as this change in the calculator, so it would not lower the estimate further.',
        };
  }

  if (
    ['last month', 'previous', 'compare', 'better', 'worse', 'progress'].some((term) =>
      query.includes(term),
    )
  ) {
    const previous = history.length >= 2 ? history[history.length - 2] : undefined;
    if (!previous)
      return {
        answer: `Your current estimate is ${formatCo2(result.totalKg)} per year. Recalculate after updating your habits to create a second data point, then I can compare your progress.`,
      };
    const change = result.totalKg - previous.totalKg;
    return {
      answer: `Your latest estimate is ${formatCo2(result.totalKg)}, ${formatCo2(Math.abs(change))} ${change > 0 ? 'higher' : change < 0 ? 'lower' : 'unchanged'} than your previous saved result of ${formatCo2(previous.totalKg)}.`,
      note: 'Dashboard history records calculator updates, not a calendar-month emissions log.',
    };
  }

  if (['average', 'benchmark', 'city', 'country'].some((term) => query.includes(term))) {
    const average = compareToAverage(result.totalTonnes, input.region);
    return {
      answer: `Your ${formatTonnes(result.totalTonnes)} annual estimate is ${formatPercent(average.percentOfAverage)} of the approximate per-person average for your selected region.`,
    };
  }

  if (['net zero', '2030', 'target', 'goal'].some((term) => query.includes(term))) {
    const target = compareToTarget(result.totalTonnes);
    const gap = Math.max(0, result.totalKg - target.target * 1000);
    return {
      answer:
        gap > 0
          ? `You are ${formatCo2(gap)} above the app’s ${formatTonnes(target.target)} annual 1.5°C target. Start with ${top ? top.title.toLowerCase() : category.toLowerCase()}.`
          : `You are within the app’s ${formatTonnes(target.target)} annual 1.5°C target.`,
    };
  }

  if (
    ['cheap', '₹', 'budget', 'one change', 'today', 'small', 'challenge', 'plan'].some((term) =>
      query.includes(term),
    )
  ) {
    return top
      ? {
          answer: `Your best next change is: ${top.title}. It could reduce your estimate by about ${formatCo2(top.estimatedSavingKg)} each year. ${top.description}`,
          note: 'I can rank CO₂e savings from your data, but I do not have local prices, so I cannot verify a ₹ budget.',
        }
      : {
          answer: `Your largest remaining opportunity is ${category.toLowerCase()}, at ${formatCo2(largest!.kg)} per year.`,
        };
  }

  if (query.includes('offset') || query.includes('tree'))
    return {
      answer: `Your current annual estimate is ${formatCo2(result.totalKg)}. Prioritize reducing ${category.toLowerCase()} first (${formatPercent(largest!.percent, 1)} of your total), then use independently verified offsets only for emissions you cannot yet avoid.`,
      note: 'Tree planting varies too widely by location and permanence for a credible one-number estimate.',
    };
  if (
    ['why', 'biggest', 'largest', 'driving', 'breakdown', 'high', 'top'].some((term) =>
      query.includes(term),
    )
  )
    return {
      answer: `${category} is your largest contributor: ${formatCo2(largest!.kg)} per year, or ${formatPercent(largest!.percent, 1)} of your ${formatCo2(result.totalKg)} total. ${top ? `Your highest-impact recorded action is ${top.title.toLowerCase()}, estimated at ${formatCo2(top.estimatedSavingKg)} per year.` : ''}`,
    };
  return {
    answer: `Your annual footprint is ${formatCo2(result.totalKg)}. ${category} leads at ${formatPercent(largest!.percent, 1)}. ${top ? `A data-backed next step is ${top.title.toLowerCase()}, which could save about ${formatCo2(top.estimatedSavingKg)} annually.` : 'Ask me about a category or a specific change to explore it.'}`,
  };
}
