# BLONG Audit Action Checklist (2025-08-11)

Reference report: docs/audits/BLONG_COMPREHENSIVE_AUDIT_2025-08-11.md

Legend: [ ] Not started  [/] In progress  [x] Done  [-] Cancelled

## P0 — Immediate (This Sprint)

- [x] Backend Payments (2–4 days)
  - [x] Implement POST /date-delivery/dates/payment
  - [x] Implement PUT /date-delivery/dates/payment/confirm
  - [x] Payment provider integration stub/config (Stripe or Paymob) via AppConfigModule
  - [x] Create DTOs + class-validator + ValidationPipe
  - [x] Minimal e2e tests for payment flow
  - Owner: Augment —  Status: [x]

- [x] Backend Matching Engine (4–7 days)
  - [x] Create MatchesModule in NestJS
  - [x] Move aiCompatibilityEngine logic to backend service
  - [x] Persist personality profiles and matches (user_personality_profiles, matches)
  - [x] Endpoints: GET /matches, GET /matches/:id (and supporting quiz endpoints if needed)
  - [x] Implement weights: Personality 40, Preference 30, Value 20, Interaction 10; min score 75
  - [x] Unit tests for scoring functions and endpoints
  - Owner: Augment —  Status: [x]

- [x] Onboarding ThemeSelection + Phase Alignment (1–1.5 days)
  - [x] Add ThemeSelection screen (between LanguageSelection and PhaseSelection)
  - [x] Update OnboardingFlow sequence: Language -> Theme -> Phase
  - [x] Align phase IDs: single, preparing, engaged
  - [x] Update i18n keys/translations accordingly
  - Owner: Augment —  Status: [x]

- [x] Design System Lock (1–2 days)
  - [x] Replace dynamic accent in AppContext with fixed COLORS palette
  - [x] Remove gradients from card backgrounds (allow accent line only)
  - [x] Enforce border radius: 8px (cards), 24px (buttons)
  - [x] Enforce spacing system: 8/16/24/32/40/48 px
  - [x] Replace non-compliant tokens/usages in onboarding and core screens
  - Owner: Augment —  Status: [x]

## P1 — Next Sprint

- [x] Navigation Consolidation (1.5–2.5 days)
  - [x] Add NavigationContainer at App root
  - [ ] Migrate MainNavigator to React Navigation (stack/tab)
  - [x] Remove MainNavigator_old.js
  - [ ] Reduce/replace navigationService usages where RN navigation is available
  - Owner: Augment —  Status: [/] (partially complete)

- [ ] Services/Utilities Cleanup (1–2 days)
  - [ ] Merge apiService and enhancedApiService (one client)
  - [ ] Consolidate error handling (one error util module)
  - [ ] Remove duplicate/legacy files (e.g., duplicate error handlers)
  - Owner: —  Status: [ ]

- [ ] Prisma Right-sizing + Indices (3–5 days)
  - [ ] Identify/confirm unused models and archive
  - [ ] Keep essential tables: users, user_profiles, user_preferences, quiz_*, photos, matches, notifications, system_settings
  - [ ] Add indexes, FKs, uniques as needed; minimize selects in services
  - [ ] Create migration scripts and backup plan
  - Owner: —  Status: [ ]

- [ ] Backend DTO Validation Coverage (1–2 days)
  - [ ] Ensure DTOs and ValidationPipe across all controllers (profile, date-delivery, questionnaire, etc.)
  - [ ] Add @Api decorators consistency for Swagger
  - Owner: —  Status: [ ]

## P2 — Following Iterations

- [ ] Screen Structure Compliance Pass (1–2 days)
  - [ ] Ensure mandatory structure: AppTransition + SafeAreaView + StatusBar + Elite Header + ScrollView
  - [ ] Replace ad-hoc headers with EliteHeader component
  - Owner: —  Status: [ ]

- [ ] Inline Styles Refactor (1–2 days)
  - [ ] Move inline styles to StyleSheet files per feature
  - [ ] Reuse EliteCard/PrimaryButton patterns
  - Owner: —  Status: [ ]

- [ ] Data Layer Decision (3–5 days if replacing React Query)
  - [ ] Decide: Keep React Query or replace with minimal caching/fetch layer
  - [ ] If replacing, implement SWR-like revalidation, cache, error/loader integration
  - Owner: —  Status: [ ]

## P3 — Tooling & QA

- [ ] CI/QA Enhancements (0.5–1 day)
  - [ ] Add bundle size reporting
  - [ ] ESLint rules to forbid non-palette colors and non-8px spacing
  - [ ] Add basic performance metrics logging in dev
  - Owner: —  Status: [ ]

---

Notes:
- Use this checklist to track progress against the comprehensive audit. Update Owner and Status as work advances.
- Each task should include associated unit/e2e tests where applicable.

