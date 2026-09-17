# 🌿 EcoTrack AI — Carbon Footprint Awareness Platform

<p align="center">
  <strong>Understand. Track. Reduce. 🌍</strong>
</p>

<p align="center">
  A privacy-first carbon footprint platform that turns a short lifestyle questionnaire into personalized emissions insights, actionable recommendations, and measurable reduction goals.
</p>

<p align="center">
  <a href="https://ecotrack-murex-gamma.vercel.app/">
    🚀 <strong>Live Demo</strong>
  </a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="https://github.com/sathwiksandesh/ecotrack">
    💻 <strong>Source Code</strong>
  </a>
</p>

---

## 🌱 What is EcoTrack AI?

**EcoTrack AI** is a web-based carbon footprint awareness platform designed to help individuals understand and reduce their environmental impact.

Instead of providing generic sustainability advice, EcoTrack analyzes a user's lifestyle information and estimates their annual **CO₂e emissions** across multiple categories.

The platform then answers three important questions:

> **Where are my emissions coming from?**
> **How does my footprint compare with meaningful benchmarks?**
> **What should I change first?**

The result is a personalized climate action experience rather than a simple carbon calculator.

---

## ✨ Key Features

### 🧮 Personalized Carbon Calculator

A guided six-step questionnaire collects information about:

* 🌍 Region
* 🚗 Transportation
* ⚡ Home energy
* 🍽️ Food habits
* 🛍️ Consumption
* 🏠 Household information

The answers are validated and converted into estimated annual emissions using documented emission factors.

---

### 📊 Interactive Results Dashboard

The dashboard provides a visual overview of the user's environmental impact.

It includes:

* Total annual CO₂e
* Category-wise emissions
* Bar chart breakdown
* Donut chart visualization
* Regional comparison
* 1.5 °C-aligned target comparison
* Historical footprint trend
* Reduction goal progress

The goal is to make environmental data understandable at a glance.

---

### 🤖 Context-Aware Recommendation Engine

EcoTrack doesn't give everyone the same list of sustainability tips.

Its recommendation engine analyzes:

```text
User Inputs
     ↓
Calculated Footprint
     ↓
Category Emissions
     ↓
Context Analysis
     ↓
Ranked Recommendations
```

For example:

* A petrol/diesel driver may receive an EV or lower-emission transport recommendation.
* A user with significant electricity emissions may receive renewable-energy suggestions.
* Food recommendations adapt to the user's existing diet instead of applying the same recommendation to everyone.
* Recommendations are ranked according to estimated potential impact.

Each recommendation includes an estimated **kg CO₂e saving** based on the same emission factors used by the calculator.

This keeps the calculator and recommendations internally consistent.

---

### 🎯 Carbon Reduction Goals

Users can set a personal reduction target and monitor their progress over time.

EcoTrack tracks:

* Current footprint
* Target footprint
* Reduction percentage
* Progress toward the goal
* Historical footprint data

This turns the calculator from a one-time experience into an ongoing sustainability tracker.

---

### 🔒 Privacy-First by Design

EcoTrack is designed around a **client-side architecture**.

There is:

* ❌ No user account
* ❌ No backend database
* ❌ No server-side personal profile
* ❌ No unnecessary data collection
* ❌ No API secret required for the core calculator

User data is stored locally in the browser using `localStorage`.

Stored data is treated as untrusted and re-validated before being used.

> **Your footprint data stays on your device.**

---

## 🧠 How EcoTrack Works

```text
                  ┌──────────────────────┐
                  │     User Inputs      │
                  │  Lifestyle & Region  │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Zod Validation    │
                  │  Type-safe schemas   │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ calculateFootprint() │
                  │ Emission Calculations│
                  └──────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌────────────┐
        │Breakdown │   │Comparisons│   │Tip Engine  │
        └────┬─────┘   └────┬─────┘   └─────┬──────┘
             │              │               │
             └──────────────┼───────────────┘
                            ▼
                  ┌──────────────────────┐
                  │    Dashboard         │
                  │ Charts + Insights +  │
                  │ Recommendations      │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Reduction Goal     │
                  │ Progress & History   │
                  └──────────────────────┘
```

---

# 🏗️ Architecture

EcoTrack follows a separation-of-concerns approach.

```text
                    EcoTrack AI
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
   Presentation                      Domain Logic
        │                                 │
   ┌────┴────┐                  ┌─────────┴──────────┐
   │  Next.js│                  │ Calculator         │
   │  React  │                  │ Emission Factors   │
   │  UI     │                  │ Tips Engine        │
   └────┬────┘                  │ Comparisons        │
        │                       │ Goals              │
        │                       │ Breakdown          │
        │                       └─────────┬──────────┘
        │                                 │
        └────────────────┬────────────────┘
                         ▼
                   Local Storage
                  Validated & Safe
```

### Design Principles

#### 1. Domain logic is isolated

Core calculations live inside `src/lib`.

The UI does not duplicate emission calculations.

#### 2. Pure functions

Domain functions are framework-independent and designed to be easy to test.

#### 3. Single source of truth

Zod schemas define and validate the application's data structures.

#### 4. Privacy by architecture

Because there is no backend database, personal calculator data doesn't need to leave the browser.

---

# 📊 Carbon Calculation Model

EcoTrack estimates emissions across major lifestyle categories.

```text
Total Carbon Footprint
│
├── 🚗 Transportation
│   ├── Car
│   ├── Public transport
│   └── Flights
│
├── ⚡ Home Energy
│   ├── Electricity
│   ├── Heating
│   └── Household allocation
│
├── 🍽️ Food
│   └── Dietary patterns
│
└── 🛍️ Consumption
    └── General consumption
```

Emission factors are documented separately so that the calculation logic can be maintained independently from the UI.

See:

**[`METHODOLOGY.md`](https://github.com/sathwiksandesh/ecotrack/blob/main/METHODOLOGY.md)**

for the assumptions, benchmarks, sources, and calculation methodology.

---

# 🎯 Benchmarks

EcoTrack provides contextual comparisons instead of displaying the user's footprint in isolation.

The dashboard can compare the calculated footprint against:

* 🌍 Global average
* 🇺🇸 US representative average
* 🇬🇧 UK representative average
* 🇪🇺 EU representative average
* 🇮🇳 India representative average
* 🎯 A personal 1.5 °C-aligned target

The current target used by the application is approximately:

**2.3 t CO₂e per person per year**

These figures are intended for **awareness and relative comparison**, not audit-grade carbon accounting.

---

# 💡 Recommendation Engine

The recommendation system is one of EcoTrack's core features.

The engine lives in:

```text
src/lib/tips-engine.ts
```

It evaluates:

```text
User Context
+
Calculated Emissions
+
Category Contributions
+
Applicable Conditions
        ↓
Recommendation Candidates
        ↓
Estimated CO₂e Savings
        ↓
Impact Ranking
        ↓
Personalized Action Plan
```

### Example

Instead of:

> "Consider driving an electric vehicle."

EcoTrack can reason from the user's actual context:

```text
Current transport:
Petrol car

Annual mileage:
12,000 km

Estimated transport emissions:
X kg CO₂e

Potential recommendation:
Consider a lower-emission vehicle or alternative transportation.

Estimated potential saving:
Y kg CO₂e / year
```

The recommendation is therefore tied to the user's situation rather than being a generic sustainability checklist.

---

# ♿ Accessibility

EcoTrack is designed with accessibility in mind and targets **WCAG 2.1 AA** principles.

Implemented accessibility considerations include:

* Semantic HTML
* Proper labels for form inputs
* `fieldset` / `legend` grouping
* Accessible validation messages
* `aria-describedby`
* `aria-live`
* Keyboard navigation
* Visible focus states
* Minimum 44px interactive targets
* Skip navigation link
* Chart data-table alternatives
* No reliance on color alone
* Reduced-motion support through `prefers-reduced-motion`

Charts are paired with accessible data representations so important information isn't dependent solely on visual interpretation.

---

# 🔐 Security

EcoTrack follows a defense-in-depth approach despite being a client-side application.

Security considerations include:

* Strict TypeScript
* Zod input validation
* Validation of persisted `localStorage` data
* No hardcoded API secrets
* Content Security Policy
* Per-request CSP nonce
* `strict-dynamic`
* Security response headers
* No unnecessary third-party requests

Security implementation details are documented in:

**[`SECURITY.md`](https://github.com/sathwiksandesh/ecotrack/blob/main/SECURITY.md)**

---

# ⚡ Performance

EcoTrack uses several performance-oriented design decisions:

* Next.js App Router
* React Server Components by default
* Minimal client-side state
* Dynamic loading for chart-heavy components
* Self-hosted fonts
* Small reusable React components
* Pure domain functions
* No backend request required for core calculations

---

# 🧪 Testing

The core domain logic is covered with unit tests using **Vitest**.

Current test suite:

**54 tests across 16 suites**

Coverage thresholds are enforced for:

| Metric     | Target |
| ---------- | -----: |
| Lines      |    90% |
| Functions  |    90% |
| Statements |    90% |
| Branches   |    85% |

Accessibility testing is also prepared through `@axe-core/playwright`.

---

# 🛠️ Tech Stack

| Technology                | Role                    |
| ------------------------- | ----------------------- |
| **Next.js 15**            | Application framework   |
| **React**                 | UI                      |
| **TypeScript**            | Type-safe development   |
| **Tailwind CSS**          | Styling                 |
| **Zod**                   | Schema validation       |
| **Recharts**              | Data visualization      |
| **Vitest**                | Unit testing            |
| **Playwright / axe-core** | Accessibility testing   |
| **ESLint**                | Code quality            |
| **Prettier**              | Formatting              |
| **Vercel**                | Deployment              |
| **localStorage**          | Client-side persistence |

---

# 📁 Project Structure

```text
ecotrack/
│
├── src/
│   │
│   ├── app/
│   │   ├── page.tsx
│   │   ├── calculator/
│   │   └── dashboard/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── calculator/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   └── layout/
│   │
│   ├── lib/
│   │   ├── calculator
│   │   ├── emission-factors
│   │   ├── schemas
│   │   ├── tips-engine
│   │   ├── comparisons
│   │   ├── breakdown
│   │   ├── goal
│   │   ├── storage
│   │   └── format
│   │
│   └── middleware.ts
│
├── METHODOLOGY.md
├── SECURITY.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 20+
* npm

## Installation

Clone the repository:

```bash
git clone https://github.com/sathwiksandesh/ecotrack.git
```

Navigate into the project:

```bash
cd ecotrack
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start development server  |
| `npm run build`         | Create production build   |
| `npm start`             | Start production server   |
| `npm run test`          | Run unit tests            |
| `npm run test:coverage` | Run tests with coverage   |
| `npm run lint`          | Run ESLint                |
| `npm run typecheck`     | Run TypeScript checks     |
| `npm run format`        | Format code with Prettier |

---

# 🌐 Deployment

EcoTrack is deployed using Vercel.

### Live Application

**https://ecotrack-murex-gamma.vercel.app/**

### Repository

**https://github.com/sathwiksandesh/ecotrack**

---

# 🗺️ Roadmap

The current architecture provides a foundation for expanding EcoTrack beyond a carbon calculator.

### 📱 User Experience

* [ ] Progressive Web App support
* [ ] Mobile-first experience improvements
* [ ] Personalized sustainability profile
* [ ] Improved onboarding

### 🤖 AI Features

* [ ] Conversational AI sustainability assistant
* [ ] Natural-language footprint explanations
* [ ] AI-generated action plans
* [ ] Personalized sustainability coaching
* [ ] RAG-based environmental knowledge assistant

### 📊 Analytics

* [ ] Long-term footprint analytics
* [ ] Monthly / yearly reports
* [ ] Advanced trend analysis
* [ ] Category-level forecasting
* [ ] Exportable sustainability reports

### 🌍 Environmental Data

* [ ] Live regional electricity-carbon intensity
* [ ] Weather-aware recommendations
* [ ] Location-based sustainability insights
* [ ] Public environmental datasets
* [ ] Real-time environmental indicators

### 🏆 Engagement

* [ ] Sustainability challenges
* [ ] Achievement system
* [ ] Streaks
* [ ] Personal milestones
* [ ] Community challenges

---

# 💭 Future Vision

EcoTrack can evolve from a **carbon footprint calculator** into a broader **personal environmental intelligence platform**.

```text
                 EcoTrack
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Carbon      Energy       Waste
    Footprint   Efficiency   Reduction
        │           │           │
        └───────────┼───────────┘
                    ▼
             AI Sustainability
                 Assistant
                    │
                    ▼
          Personalized Action Plan
                    │
                    ▼
             Measurable Impact
```

The long-term goal is simple:

> **Use AI, data, and thoughtful UX to turn environmental awareness into measurable action.**

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the repository

```bash
git fork https://github.com/sathwiksandesh/ecotrack
```

### 2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

### 3. Make your changes

Follow the existing project conventions.

### 4. Run checks

```bash
npm run lint
npm run typecheck
npm run test
```

### 5. Commit

```bash
git commit -m "feat: add new sustainability feature"
```

### 6. Push and open a Pull Request

```bash
git push origin feature/new-feature
```

---

# 👨‍💻 Developer

## Siddhantam Sathwik Sandesh

Artificial Intelligence & Data Science Student

Building projects at the intersection of:

**AI • Data Science • Machine Learning • Web Development • Sustainability**

### Connect

* 🐙 GitHub — [@sathwiksandesh](https://github.com/sathwiksandesh)
* 🌱 EcoTrack — [Live Demo](https://ecotrack-murex-gamma.vercel.app/)
* 💻 Repository — [GitHub Repository](https://github.com/sathwiksandesh/ecotrack)

---

# ⭐ Support the Project

If EcoTrack helped you or you find the project interesting:

⭐ Star the repository
🍴 Fork the project
🐛 Report bugs
💡 Suggest improvements
🤝 Contribute

---

# 📄 Documentation

Additional project documentation:

* 📐 [`METHODOLOGY.md`](https://github.com/sathwiksandesh/ecotrack/blob/main/METHODOLOGY.md) — Carbon calculation methodology and assumptions
* 🔐 [`SECURITY.md`](https://github.com/sathwiksandesh/ecotrack/blob/main/SECURITY.md) — Security architecture and considerations

---

<p align="center">

🌱 **EcoTrack AI**

<strong>Understand your footprint. Choose your actions. Measure your impact.</strong>

<br/>

Built with ❤️ for a more sustainable future.

</p>
