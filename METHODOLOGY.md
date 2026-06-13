# Methodology

EcoTrack AI estimates an individual's **annual** carbon footprint in kg CO₂e (carbon-dioxide
equivalent). All figures are **approximate** and intended for awareness and relative
comparison — not audit-grade carbon accounting. Emission factors live in
`src/lib/emission-factors.ts`; the calculation is in `src/lib/calculator.ts`.

## Sources

- **UK DESNZ / DEFRA** — Greenhouse Gas Conversion Factors for Company Reporting (2023): road
  transport, public transport, aviation, heating fuels.
- **US EPA** — Emission Factors for Greenhouse Gas Inventories.
- **IEA / Ember** — electricity grid carbon intensity by region (2023).
- **Our World in Data** — CO₂ and Greenhouse Gas Emissions; per-capita averages.
- **Scarborough et al. (2023)**, *Nature Food* — dietary greenhouse gas footprints by diet type.

## Categories & formulas

All results are annualized (×52 for weekly inputs, ×12 for monthly).

**Transport**
- Car: `km/week × 52 × fuelFactor` — petrol 0.192, diesel 0.171, hybrid 0.111, electric
  0.053 kg CO₂e/km.
- Public transport: `km/week × 52 × 0.06` kg CO₂e/passenger-km (blended bus + rail).
- Flights: `shortHaul × 250 + longHaul × 1100` kg CO₂e per one-way flight (includes a
  non-CO₂ radiative-forcing uplift).

**Home** (attributed per person by dividing by household size)
- Electricity: `kWh/month × 12 × gridIntensity(region) × (1 − renewable%)`.
- Heating: `amount/month × 12 × heatingFactor`. The amount is the **physical quantity of
  fuel** burned, in the fuel's natural unit — people know how much fuel they use, not "kWh
  of delivered heat". Factors (kg CO₂e per unit): natural gas 2.02/m³, heating oil 2.52/L,
  LPG 2.95/kg (a standard cylinder is ≈ 14.2 kg), firewood 0.40/kg. Electric resistance is
  metered in kWh and uses the grid factor; a heat pump divides the grid factor by a COP of
  2.8. **Firewood caveat:** biomass combustion CO₂ is biogenic and treated as carbon-neutral
  under standard GHG convention, so its factor counts only non-biogenic CH₄/N₂O; unsustainable
  harvesting makes the real impact substantially higher.
- Grid intensity (kg CO₂e/kWh): US 0.37, UK 0.21, EU 0.25, IN 0.71, Global 0.48.

**Food**
- `dietFactor × foodWasteMultiplier`. Diets (kg CO₂e/yr): vegan 1100, vegetarian 1400,
  pescatarian 1700, low-meat 2200, medium-meat 2800, high-meat 3600. Waste multiplier: low
  1.0, medium 1.1, high 1.25.

**Consumption**
- `shoppingFactor × recyclingMultiplier`. Shopping (kg CO₂e/yr): minimal 600, average 1500,
  frequent 3000. Recycling multiplier 0.92 when the person recycles routinely.

## Benchmarks

- Per-capita averages (tonnes CO₂e/yr, approximate): US 14.0, UK 5.0, EU 6.5, IN 1.9,
  Global 4.7.
- Personal target: **2.3 t CO₂e/yr**, aligned with a 1.5 °C pathway.

## Tips engine

Each recommendation's estimated saving is derived from the **same** emission factors as the
calculator, so the numbers are internally consistent. Tips are generated only when relevant
to the person's inputs and ranked by estimated annual saving (see `src/lib/tips-engine.ts`).

## Limitations

Footprints are modeled from typical factors, not personal utility bills or receipts; results
can differ from a detailed audit. Embodied emissions (e.g. manufacturing) are approximated at
a high level. Factors are periodically revised by their publishers; update
`emission-factors.ts` to refresh them.
