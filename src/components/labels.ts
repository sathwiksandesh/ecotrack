import type {
  CarFuel,
  CategoryKey,
  Diet,
  FoodWaste,
  HeatingFuel,
  Region,
  Shopping,
} from '@/lib';
import type { IconName } from '@/components/ui';

/**
 * Presentation-only mappings from the engine's enum values to human-readable
 * labels, plus per-category display metadata (icon + chart color). These are UI
 * concerns, so they live with the components rather than in the pure `@/lib` core.
 *
 * Chart colors are resolved from CSS custom properties (defined in globals.css)
 * rather than hard-coded hex, keeping a single source of truth for the palette.
 */

export const REGION_LABELS: Record<Region, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  EU: 'European Union',
  IN: 'India',
  GLOBAL: 'Global average',
};

export const CAR_FUEL_LABELS: Record<CarFuel, string> = {
  petrol: 'Petrol / gasoline',
  diesel: 'Diesel',
  hybrid: 'Hybrid',
  electric: 'Electric',
  none: "I don't drive",
};

export const HEATING_FUEL_LABELS: Record<HeatingFuel, string> = {
  gas: 'Natural gas',
  oil: 'Heating oil',
  lpg: 'LPG (cylinder gas)',
  wood: 'Firewood / biomass',
  electric: 'Electric (resistance)',
  heatpump: 'Heat pump',
  none: 'None',
};

export const DIET_LABELS: Record<Diet, string> = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  pescatarian: 'Pescatarian',
  low_meat: 'Low meat',
  medium_meat: 'Medium meat',
  high_meat: 'High meat',
};

export const FOOD_WASTE_LABELS: Record<FoodWaste, string> = {
  low: 'Low — I rarely waste food',
  medium: 'Medium — some waste',
  high: 'High — frequent waste',
};

export const SHOPPING_LABELS: Record<Shopping, string> = {
  minimal: 'Minimal — only essentials',
  average: 'Average',
  frequent: 'Frequent — I shop a lot',
};

export const EFFORT_LABELS = {
  low: 'Low effort',
  medium: 'Medium effort',
  high: 'High effort',
} as const;

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  icon: IconName;
  /** A CSS color value referencing a design token. */
  color: string;
}

export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  transport: { key: 'transport', label: 'Transport', icon: 'car', color: 'var(--color-primary)' },
  home: { key: 'home', label: 'Home energy', icon: 'home', color: 'var(--color-accent)' },
  food: { key: 'food', label: 'Food', icon: 'food', color: 'var(--color-secondary)' },
  consumption: {
    key: 'consumption',
    label: 'Shopping & goods',
    icon: 'shopping',
    color: 'var(--color-warning)',
  },
};

export const CATEGORY_ORDER: ReadonlyArray<CategoryKey> = [
  'transport',
  'home',
  'food',
  'consumption',
];

/** Build typed `{value,label}` option arrays from an enum + label map. */
export function toOptions<T extends string>(
  values: ReadonlyArray<T>,
  labels: Record<T, string>,
): ReadonlyArray<{ value: T; label: string }> {
  return values.map((value) => ({ value, label: labels[value] }));
}
