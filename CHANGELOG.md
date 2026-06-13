# Changelog

All notable changes to EcoTrack AI are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- `src/lib/math.ts` — shared `round(n, places?)` utility extracted from the three
  modules (`calculator.ts`, `tips-engine.ts`, `goal.ts`) that previously each
  defined their own identical local helper. Centralising it removes the DRY
  violation and gives the helper its own test suite.
- `src/lib/math.test.ts` — unit tests for the `round` utility.
- `src/components/ui/ErrorBoundary.tsx` — class-based React error boundary that
  catches unhandled render errors and displays a graceful recovery UI instead of a
  blank screen. Exported from `@/components/ui`.
- Error boundaries added to `/calculator` and `/dashboard` routes.

### Changed
- `src/lib/calculator.ts`, `src/lib/tips-engine.ts`, `src/lib/goal.ts` — migrated
  from local `round()` definitions to the shared `@/lib/math` import.
- `src/lib/cn.ts` — narrowed `ClassValue` type from `string | number | false | null
  | undefined` to `string | false | null | undefined`. Numeric class names are not
  valid in Tailwind or standard HTML; accepting them silently was misleading.
- `src/lib/comparisons.ts` — extracted the near-band threshold into a named
  constant `NEAR_BAND = 0.05` and made both comparison functions use it
  symmetrically. Previously `compareToAverage` had an asymmetric lower bound (< 95)
  vs. upper bound (≤ 105) without documentation; both now use the same ±5% window.
- `src/components/calculator/CalculatorForm.tsx` — replaced the `validateCurrent`
  switch statement with a `STEP_VALIDATORS` lookup table, making adding or
  reordering steps a single-site change and improving readability.
- `src/lib/index.ts` — exports `src/lib/math` so callers can use `round` via the
  barrel import if needed.
