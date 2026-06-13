import {
  CAR_FUEL_FACTOR,
  TRANSIT_FACTOR,
  FLIGHT_FACTOR,
  GRID_INTENSITY,
  HEATING_FUEL_FACTOR,
  HEAT_PUMP_COP,
  DIET_FACTOR,
  FOOD_WASTE_MULTIPLIER,
  SHOPPING_FACTOR,
  RECYCLING_MULTIPLIER,
  WEEKS_PER_YEAR,
  MONTHS_PER_YEAR,
} from './emission-factors';
import type { HeatingFuel, Region } from './emission-factors';
import type { FootprintInput, FootprintResult } from './schemas';
import { round } from './math';

/**
 * Resolve the heating emission factor for a given fuel and region, in kg CO₂e per
 * natural unit of fuel (m³, litre, kg) — or per kWh for the two electric options.
 * Electric resistance heating uses the grid factor; a heat pump divides that by
 * its coefficient of performance.
 */
export function heatingFactorFor(fuel: HeatingFuel, region: Region): number {
  if (fuel === 'electric') return GRID_INTENSITY[region];
  if (fuel === 'heatpump') return GRID_INTENSITY[region] / HEAT_PUMP_COP;
  return HEATING_FUEL_FACTOR[fuel];
}

/**
 * Calculate an annual carbon footprint from validated input.
 *
 * Pure function: no side effects, deterministic output. Home emissions are
 * attributed per person by dividing by household size.
 */
export function calculateFootprint(input: FootprintInput): FootprintResult {
  const { region, transport, home, food, consumption } = input;

  // --- Transport (annual kg CO₂e) ---
  const car = transport.carKmPerWeek * WEEKS_PER_YEAR * CAR_FUEL_FACTOR[transport.carFuel];
  const transit = transport.publicTransitKmPerWeek * WEEKS_PER_YEAR * TRANSIT_FACTOR;
  const flights =
    transport.flightsShortHaulPerYear * FLIGHT_FACTOR.shortHaul +
    transport.flightsLongHaulPerYear * FLIGHT_FACTOR.longHaul;
  const transportTotal = car + transit + flights;

  // --- Home (annual kg CO₂e, attributed per person) ---
  const electricityRaw =
    home.electricityKwhPerMonth *
    MONTHS_PER_YEAR *
    GRID_INTENSITY[region] *
    (1 - home.renewablePercent / 100);
  const heatingRaw =
    home.heatingAmountPerMonth * MONTHS_PER_YEAR * heatingFactorFor(home.heatingFuel, region);
  const electricity = electricityRaw / home.householdSize;
  const heating = heatingRaw / home.householdSize;
  const homeTotal = electricity + heating;

  // --- Food (annual kg CO₂e) ---
  const foodTotal = DIET_FACTOR[food.diet] * FOOD_WASTE_MULTIPLIER[food.foodWaste];

  // --- Consumption (annual kg CO₂e) ---
  const consumptionTotal =
    SHOPPING_FACTOR[consumption.shopping] * (consumption.recycles ? RECYCLING_MULTIPLIER : 1);

  const totalKg = transportTotal + homeTotal + foodTotal + consumptionTotal;

  return {
    totalKg: round(totalKg),
    totalTonnes: round(totalKg / 1000),
    categories: {
      transport: round(transportTotal),
      home: round(homeTotal),
      food: round(foodTotal),
      consumption: round(consumptionTotal),
    },
    details: {
      car: round(car),
      transit: round(transit),
      flights: round(flights),
      electricity: round(electricity),
      heating: round(heating),
    },
  };
}
