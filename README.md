# 🌿 EcoTrack AI — Carbon Footprint Awareness Platform

> Understand, track, and reduce your personal carbon footprint — privately, in your browser.

**Live demo:** (https://eco-track-ai-seven.vercel.app/)

EcoTrack AI turns a two-minute questionnaire into a personalized climate action plan: your
estimated annual CO₂e, a category breakdown, how you compare to regional averages and a
science-based 1.5 °C target, and a ranked set of the highest-impact changes you can make —
then it lets you set and track a reduction goal over time.

## Chosen vertical

**Sustainability / climate action.** Most people want to lower their environmental impact but
don't know (a) what their footprint actually is, or (b) which changes matter most. Generic
advice ("recycle more") ignores personal context. EcoTrack AI acts as a **personal carbon
assistant** that reasons over each person's situation and tells them where their emissions
come from and what to do first.

## What it does

- **Six-step calculator** — region, transport, home energy, food, and consumption.
- **Results dashboard** — total footprint, category breakdown (bar + donut), comparison to
  the regional average and the 1.5 °C target, and a trend over time.
- **Smart, context-aware recommendations** — a ranked list of actions, each with the
  estimated kg CO₂e it would save _for this user_.
- **Goal tracking** — set a reduction target and track progress across visits.
- **100% client-side** — no account, no server, nothing leaves the device.

## Approach & logic

**A dynamic assistant, not a static calculator.** The heart of EcoTrack AI is a deterministic
recommendation engine (`src/lib/tips-engine.ts`) that makes logical decisions from user
context: it inspects the person's inputs and computed footprint and emits only the actions
relevant to them. It suggests switching to an EV _only_ if they drive a petrol/diesel car —
and quantifies the saving from their actual mileage; it suggests a renewable tariff only if
their electricity emissions are non-zero; it proposes a realistic next-step diet rather than
telling everyone to go vegan. Every recommendation's saving is computed from the **same**
emission factors as the calculator, so the numbers stay internally consistent, and tips are
ranked by impact so the biggest wins surface first.

**Separation of concerns.** All domain logic lives in `src/lib` as pure, framework-free,
fully-typed functions, with a **Zod schema as the single source of truth** for every data
shape. The UI imports from `@/lib` and never re-implements a calculation — keeping the logic
trivially testable and the components thin.

**Privacy & safety by construction.** There is no backend and no database, so there is nothing
to breach and no secrets to leak. Persistence is `localStorage`, treated as untrusted and
re-validated on every read.

## How the solution works

Stack: **Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Zod · Recharts.**

1. **`/calculator`** — a six-step form. Each field maps to `footprintInputSchema`; inputs are
   validated with Zod and errors are surfaced accessibly. Answers persist to `localStorage`.
2. **`calculateFootprint(input)`** converts answers into annual kg CO₂e per category using
   published emission factors.
3. **`/dashboard`** — runs `compareToTarget` / `compareToAverage`, renders the breakdown
   charts (each with an accessible data-table fallback), lists ranked tips from
   `generateTips`, and tracks the reduction goal and history trend.

Domain modules (`src/lib`): `emission-factors` (cited data + benchmarks), `schemas` (Zod),
`calculator`, `tips-engine`, `comparisons`, `breakdown`, `goal`, `storage` (validated,
fail-safe), `format`. These are rendered by ~34 small, typed React components
(`src/components`) — Server Components by default, with client islands for the form and charts.

## Assumptions

- Emission factors are **approximate**, for awareness and relative comparison — not
  audit-grade accounting. Figures and sources are documented in [`METHODOLOGY.md`](./METHODOLOGY.md).
- Home energy is attributed **per person** by dividing by household size.
- Flights are modeled as an average per one-way trip (short vs long haul). Heating is entered
  as the **physical quantity of fuel** in its natural unit (people know litres / m³ /
  cylinders, not kWh of delivered heat).
- Regional grid intensities and per-capita averages use representative 2023 values for
  US / UK / EU / IN / Global; the personal target is **2.3 t CO₂e/yr** (1.5 °C-aligned).
- Biomass (firewood) CO₂ is treated as biogenic / carbon-neutral per standard GHG convention
  (caveated in the methodology).

## Evaluation focus

- **Code Quality** — strict TypeScript (no `any`), pure domain logic isolated in `src/lib`,
  Zod as the single source of truth, small typed components, ESLint + Prettier, Conventional Commits.
- **Security** — no backend or secrets; a per-request **nonce-based Content-Security-Policy**
  (`src/middleware.ts`) with `strict-dynamic`, plus a full set of security headers
  (`next.config.ts`); all input validated; `localStorage` treated as untrusted. See
  [`SECURITY.md`](./SECURITY.md).
- **Efficiency** — React Server Components by default, a dynamically-imported chart bundle,
  self-hosted fonts (no third-party requests), minimal client state.
- **Testing** — **54 unit tests across 16 suites** (Vitest) covering the logic core, with
  coverage thresholds (90% lines/functions/statements, 85% branches) enforced in
  `vitest.config.ts` and CI; `@axe-core/playwright` is wired for accessibility E2E.
- **Accessibility (WCAG 2.1 AA)** — labelled inputs, `fieldset`/`legend` groups, errors via
  `aria-describedby` + `aria-live`, full keyboard support, visible focus, ≥44px targets, a
  skip link, charts paired with data tables (never color alone), and `prefers-reduced-motion`
  respected.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run test` / `npm run test:coverage` | Unit tests / coverage |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm run format` | Prettier |

## Project structure

```
src/
  app/         routes: / (landing), /calculator, /dashboard
  components/  ui/, calculator/, charts/, dashboard/, layout/
  lib/         pure domain logic + Zod schemas (+ unit tests)
  middleware.ts  per-request CSP nonce
```


