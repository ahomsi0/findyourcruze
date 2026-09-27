# Motch

Motch is a conversational car recommendation app. It asks about the way someone drives, what they can spend and what they care about, then turns a broad search into three explainable car matches.

The first version is a working vertical slice for a Lebanon demo market. Vehicle prices, specifications, ratings and monthly ownership costs are mock estimates; they are not live listings or a quote.

## Current features

- A mobile-first homepage explaining the Motch experience.
- A configuration-driven questionnaire with conditional financing and EV charging questions.
- Candidate counts calculated from the mock dataset and the same hard filters used for recommendations.
- A swipe-style preference stage with drag, buttons and arrow-key controls.
- A deterministic recommendation engine with hard constraints, weighted preferences, match explanations and trade-offs.
- Three recommended matches with an expandable score breakdown.
- Vehicle detail pages with mock specifications, estimated ownership cost and similar cars.
- A local garage and a side-by-side comparison for up to three cars.
- Local browser persistence for answers, swipe signals, saved cars and comparison selections.
- Unit tests for financing, energy cost, hard filtering and recommendation ranking.

## Architecture

The App Router pages stay small and delegate interactive behavior to focused client components. Domain data and pure calculations live outside the UI so they can later move to a service without changing the presentation layer.

### Recommendation engine

`filterCars` applies explicit constraints such as budget ceiling, excluded fuel types and body style. `scoreCar` then combines normalized car ratings with the user’s weights, financial fit and swipe-derived style signals. `rankCars` sorts the explainable results. Fuel economy and other soft preferences affect a score rather than eliminating a car.

The current ranking is deterministic and uses no AI or external service. The displayed match percentage is a demo score, not a probability of satisfaction.

### Project structure

```text
src/
  app/                       Routes and shared styles
  components/                Home, questionnaire, swipe, results and car UI
  data/                      Typed mock vehicles and market assumptions
  features/
    affordability/           Financing, fuel and ownership calculations
    questionnaire/           Zod answers and question configuration
    recommendation/          Hard filters, weights, scoring and ranking
  hooks/                     Client hydration helpers
  lib/                       Formatting and small shared utilities
  store/                     Persisted questionnaire and garage state
  types/                     Car and recommendation domain types
```

## Tech stack

Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui (Base UI), Motion, Zustand, Zod, Lucide React, Vitest, ESLint and Prettier.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
pnpm lint
pnpm test
pnpm build
```

## Market assumptions

Demo price ranges and ownership assumptions are centralized in `src/data/cars.ts` and `src/data/market.ts`. The starting market is Lebanon and values are shown in USD. Finance payment, fuel or electricity, insurance, maintenance and registration are clearly labeled estimates. Real market data should replace these assumptions before production decisions are made.

## Roadmap

- Market-specific vehicle catalogs and live pricing.
- A database for cars, specifications, markets and saved recommendations.
- User accounts and sync across devices.
- Natural-language explanations layered over the deterministic score.
- Listing and dealership integrations.
- Country-specific pricing, taxes, fuel, insurance and service data.
- Mobile and PWA improvements.
