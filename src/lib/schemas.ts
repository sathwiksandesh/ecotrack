import { z } from 'zod';
import {
  REGIONS,
  CAR_FUELS,
  HEATING_FUELS,
  DIETS,
  FOOD_WASTE_LEVELS,
  SHOPPING_LEVELS,
} from './emission-factors';

/**
 * Zod schemas are the single source of truth for data shapes. Types are inferred
 * from them, so there is no chance of the runtime validation and the static types
 * drifting apart. These schemas validate BOTH user form input and any data read
 * back from localStorage (which is treated as untrusted).
 */

const nonNegative = z.number().finite().nonnegative();
const percent = z.number().finite().min(0).max(100);
const nonNegativeInt = z.number().int().nonnegative();

export const transportInputSchema = z.object({
  carKmPerWeek: nonNegative.max(10_000).default(0),
  carFuel: z.enum(CAR_FUELS).default('petrol'),
  publicTransitKmPerWeek: nonNegative.max(10_000).default(0),
  flightsShortHaulPerYear: nonNegativeInt.max(500).default(0),
  flightsLongHaulPerYear: nonNegativeInt.max(500).default(0),
});

export const homeInputSchema = z.object({
  electricityKwhPerMonth: nonNegative.max(100_000).default(0),
  renewablePercent: percent.default(0),
  heatingFuel: z.enum(HEATING_FUELS).default('gas'),
  heatingAmountPerMonth: nonNegative.max(100_000).default(0),
  householdSize: z.number().int().min(1).max(20).default(1),
});

export const foodInputSchema = z.object({
  diet: z.enum(DIETS).default('medium_meat'),
  foodWaste: z.enum(FOOD_WASTE_LEVELS).default('medium'),
});

export const consumptionInputSchema = z.object({
  shopping: z.enum(SHOPPING_LEVELS).default('average'),
  recycles: z.boolean().default(false),
});

export const footprintInputSchema = z.object({
  region: z.enum(REGIONS).default('GLOBAL'),
  transport: transportInputSchema,
  home: homeInputSchema,
  food: foodInputSchema,
  consumption: consumptionInputSchema,
});

export type FootprintInput = z.infer<typeof footprintInputSchema>;

export const CATEGORY_KEYS = ['transport', 'home', 'food', 'consumption'] as const;
export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export const footprintResultSchema = z.object({
  totalKg: z.number(),
  totalTonnes: z.number(),
  categories: z.object({
    transport: z.number(),
    home: z.number(),
    food: z.number(),
    consumption: z.number(),
  }),
  details: z.object({
    car: z.number(),
    transit: z.number(),
    flights: z.number(),
    electricity: z.number(),
    heating: z.number(),
  }),
});
export type FootprintResult = z.infer<typeof footprintResultSchema>;

export const goalSchema = z.object({
  targetTonnes: z.number().finite().positive(),
  baselineTonnes: z.number().finite().nonnegative(),
  createdAt: z.string().min(1),
});
export type Goal = z.infer<typeof goalSchema>;

export const historyEntrySchema = z.object({
  date: z.string().min(1),
  totalKg: z.number().finite(),
  totalTonnes: z.number().finite(),
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export const historySchema = z.array(historyEntrySchema);

/** A complete, valid set of default inputs — handy as initial UI state. */
export const defaultFootprintInput: FootprintInput = footprintInputSchema.parse({
  region: 'GLOBAL',
  transport: {},
  home: {},
  food: {},
  consumption: {},
});
