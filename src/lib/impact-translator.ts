import { CAR_FUEL_FACTOR, FLIGHT_FACTOR } from './emission-factors';

/** Approximate CO₂e removed by one established tree over a year, in kg. */
export const TREE_YEAR_KG_CO2E = 60;

export interface ImpactEquivalents {
  treeYears: number;
  petrolDrivingKm: number;
  shortHaulFlights: number;
}

/** Converts kg CO₂e into simple, approximate real-world reference points. */
export function translateImpact(kgCo2e: number): ImpactEquivalents {
  const kg = Math.max(0, kgCo2e);
  return {
    treeYears: kg / TREE_YEAR_KG_CO2E,
    petrolDrivingKm: kg / CAR_FUEL_FACTOR.petrol,
    shortHaulFlights: kg / FLIGHT_FACTOR.shortHaul,
  };
}
