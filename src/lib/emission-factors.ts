/**
 * Emission factors & benchmark data for EcoTrack AI.
 *
 * All values are APPROXIMATE and intended for awareness and relative comparison —
 * not audit-grade carbon accounting. See METHODOLOGY.md for full sourcing and caveats.
 *
 * Primary sources:
 *  - UK DESNZ / DEFRA Greenhouse Gas Conversion Factors (2023)
 *  - US EPA Emission Factors for Greenhouse Gas Inventories
 *  - Our World in Data — CO₂ and Greenhouse Gas Emissions
 *  - Scarborough et al. (2023), dietary greenhouse gas footprints
 *  - IEA / Ember — electricity grid carbon intensity by region (2023)
 *
 * Units are kg CO₂e unless otherwise noted.
 */

export const REGIONS = ['US', 'UK', 'EU', 'IN', 'GLOBAL'] as const;
export type Region = (typeof REGIONS)[number];

export const CAR_FUELS = ['petrol', 'diesel', 'hybrid', 'electric', 'none'] as const;
export type CarFuel = (typeof CAR_FUELS)[number];

export const HEATING_FUELS = ['gas', 'oil', 'lpg', 'wood', 'electric', 'heatpump', 'none'] as const;
export type HeatingFuel = (typeof HEATING_FUELS)[number];

export const DIETS = [
  'vegan',
  'vegetarian',
  'pescatarian',
  'low_meat',
  'medium_meat',
  'high_meat',
] as const;
export type Diet = (typeof DIETS)[number];

export const FOOD_WASTE_LEVELS = ['low', 'medium', 'high'] as const;
export type FoodWaste = (typeof FOOD_WASTE_LEVELS)[number];

export const SHOPPING_LEVELS = ['minimal', 'average', 'frequent'] as const;
export type Shopping = (typeof SHOPPING_LEVELS)[number];

/** Electricity grid carbon intensity, kg CO₂e per kWh (2023, approximate). */
export const GRID_INTENSITY: Record<Region, number> = {
  US: 0.37,
  UK: 0.21,
  EU: 0.25,
  IN: 0.71,
  GLOBAL: 0.48,
};

/** Representative car emissions, kg CO₂e per km, by fuel type. */
export const CAR_FUEL_FACTOR: Record<CarFuel, number> = {
  petrol: 0.192,
  diesel: 0.171,
  hybrid: 0.111,
  electric: 0.053,
  none: 0,
};

/** Public transport blended factor, kg CO₂e per passenger-km. */
export const TRANSIT_FACTOR = 0.06;

/** Average emissions per ONE-WAY flight, kg CO₂e (includes non-CO₂ radiative forcing uplift). */
export const FLIGHT_FACTOR = {
  shortHaul: 250,
  longHaul: 1100,
} as const;

/**
 * Heating fuel emissions, kg CO₂e per NATURAL UNIT of fuel burned (see
 * HEATING_FUEL_UNIT). People know how much fuel they use — cubic metres of gas,
 * litres of oil, kilograms of LPG or firewood — not "kWh of delivered heat", so
 * the input and these factors are expressed per physical unit.
 *
 * 'electric' and 'heatpump' have no entry here: they are metered in kWh and are
 * resolved against the regional grid in the calculator instead.
 *
 * Wood is biomass: its combustion CO₂ is biogenic and treated as carbon-neutral
 * under standard GHG convention, so this factor counts only the non-biogenic
 * CH₄/N₂O of typical household burning. Unsustainable harvesting makes the real
 * impact higher — see METHODOLOGY.md.
 */
export const HEATING_FUEL_FACTOR: Record<Exclude<HeatingFuel, 'electric' | 'heatpump'>, number> = {
  gas: 2.02, // per m³
  oil: 2.52, // per litre
  lpg: 2.95, // per kg (≈ 14.2 kg per standard cylinder)
  wood: 0.4, // per kg (non-biogenic GHGs only)
  none: 0,
};

/**
 * The natural unit each heating fuel is measured in. Lives next to the factor so
 * the two cannot drift apart; the UI reads it to label the amount input.
 */
export const HEATING_FUEL_UNIT: Record<HeatingFuel, string> = {
  gas: 'm³',
  oil: 'L',
  lpg: 'kg',
  wood: 'kg',
  electric: 'kWh',
  heatpump: 'kWh',
  none: '',
};

/** Heat-pump coefficient of performance (electricity → heat multiplier). */
export const HEAT_PUMP_COP = 2.8;

/** Annual dietary footprint, kg CO₂e per year. */
export const DIET_FACTOR: Record<Diet, number> = {
  vegan: 1100,
  vegetarian: 1400,
  pescatarian: 1700,
  low_meat: 2200,
  medium_meat: 2800,
  high_meat: 3600,
};

/** Multiplier applied to dietary footprint based on food-waste habits. */
export const FOOD_WASTE_MULTIPLIER: Record<FoodWaste, number> = {
  low: 1.0,
  medium: 1.1,
  high: 1.25,
};

/** Annual goods & services (shopping) footprint, kg CO₂e per year. */
export const SHOPPING_FACTOR: Record<Shopping, number> = {
  minimal: 600,
  average: 1500,
  frequent: 3000,
};

/** Multiplier applied to consumption when the person recycles routinely. */
export const RECYCLING_MULTIPLIER = 0.92;

/** Average annual per-capita footprint, tonnes CO₂e (approximate, 2023). */
export const PER_CAPITA_AVERAGE_TONNES: Record<Region, number> = {
  US: 14.0,
  UK: 5.0,
  EU: 6.5,
  IN: 1.9,
  GLOBAL: 4.7,
};

/** Personal annual target aligned with a 1.5 °C pathway, tonnes CO₂e. */
export const TARGET_TONNES = 2.3;

export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
