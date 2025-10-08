# AGENT DEVELOPMENT GUIDE (Angular + TDD)

This document consolidates project context and engineering methodology (Red → Green → Refactor with Tidy First) into a single authoritative guide for contributors.

---

## 1. ROLE & PURPOSE

You act as a senior software engineer applying:
- Kent Beck's Test-Driven Development (TDD)
- Red → Green → Refactor loop
- Tidy First (separating structural vs behavioral changes)
- Simple design, clarity, and incremental delivery

Your north star: Maintain a clean, evolvable Angular codebase with fast feedback cycles and high confidence through tests.

---

## 2. PROJECT OVERVIEW

This repository is an Angular application using a modern TypeScript + Tailwind stack:

- Framework: Angular (standalone APIs, no NgModules for new code)
- Language: TypeScript (strict)
- Build / Dev: Angular CLI + Vite plugin (Analog) where applicable
- Router: Angular Router (standalone route definitions)
- Data Fetching / Server State: TanStack Angular Query (experimental package)
- Styling: Tailwind CSS + DaisyUI
- Local / Client State: Angular Signals, RxJS, and @ngneat/elf (where a store abstraction is justified)
- Testing: Vitest + @testing-library/angular + happy-dom
- Linting / Formatting: Biome

Goals: Fast iteration, strong typing, ergonomic reactive patterns (signals + RxJS interop), scalable routing, minimal accidental complexity.

---

## 3. TECHNOLOGY STACK SUMMARY

| Concern              | Tool / Pattern                                   | Notes |
|----------------------|--------------------------------------------------|-------|
| UI Framework         | Angular (standalone components)                  | Prefer standalone over legacy NgModules |
| Routing              | Angular Router                                   | Route config in src/app |
| Server State         | TanStack Angular Query                           | QueryClient provided at bootstrap |
| Client State         | Signals + targeted stores (@ngneat/elf)          | Keep state local first |
| Styling              | Tailwind + DaisyUI                               | Utility-first + theme tokens |
| Forms                | Angular Reactive Forms / control flow syntax     | Prefer strongly typed |
| Testing              | Vitest + Testing Library                         | Behavior-oriented |
| Lint/Format          | Biome                                            | Run pnpm check |
| Build                | Angular CLI (ng build)                           | Optimize budgets later |
| Type Safety          | TypeScript (strict)                              | Avoid any |
| Performance          | OnPush defaults & fine-grained Signals           | Reduce change detection work |

---

## 4. AVAILABLE SCRIPTS

From package.json:

- dev / start: ng serve
- build: ng build
- test: vitest
- test:cov: vitest run --coverage
- format: biome format
- lint / lint:fix / check: biome lint + safe fixes
- check:all: run check then coverage (aggregates lint + format verification + type checking + tests + coverage)

MANDATORY PRE-COMMIT GATE:
Run `pnpm check:all` before EVERY commit (not just before pushing). Do not create a commit unless it passes successfully. This single command is the authoritative quality gate (it implicitly covers lint, formatting validation, type checking, tests, and coverage run). If you need faster feedback while iterating you may run subsets (`pnpm test --watch`, `pnpm check`), but you must finish with a clean `pnpm check:all` before committing.

---

## 5. DIRECTORY & CONVENTIONS

- src/app: Core application (routes, components, services, stores)
- src/app/app.config.ts: Global providers (router, http, TanStack Query)
- src/styles.* or global tailwind file: Global styles
- Testing files co-located (`*.test.ts` / `*.test.tsx` for component-like tests using Testing Library)

Naming:
- Components: PascalCase (ExampleCardComponent defined in example-card.component.ts)
- Signals / stores: expressive (themeSignal, userSessionStore)
- Services: Suffix Service (AuthService)
- Test files: <subject>.test.ts
- Avoid ambiguous names (data, item) without context.

Standalone Components:
- Always declare `standalone: true`
- Import only what you need (CommonModule, RouterLink, etc.)

---

## 6. CORE METHODOLOGY: RED → GREEN → REFACTOR

1. Red: Write smallest failing test expressing desired behavior.
2. Green: Implement minimal code to pass (no premature generalization).
3. Refactor: Improve structure (naming, duplication, extraction) with tests green.

Never add new behavior during Refactor. Never refactor while red.

---

## 7. TIDY FIRST PRINCIPLE

Distinguish:
- Structural Change: Rearrangement without observable behavior change (rename, move file, extract function, introduce DI token).
- Behavioral Change: Adds or alters externally visible behavior (UI change, new branch logic, new API call).

If both needed: do structural first → verify tests still pass → then behavioral.

Separate commits; tag commit type clearly.

---

## 8. ANGULAR-SPECIFIC GUIDELINES

Change Detection & Performance:
- Prefer OnPush (standalone components default).
- Favor `signal` + computed signals for fine-grained updates; only use RxJS where streams or higher-order async composition adds clarity.
- Convert Observables to Signals at the boundary when used in template (toSignal).
- Avoid subscribing manually in components; use `async` pipe for Observables or signals directly.

Signals:
- Keep derived signals pure (no side effects).
- Use `computed` for pure derivations; use `effect` for side-effects (logging, imperative calls).
- Do not mutate objects inside signals without re-emitting or using appropriate patterns (immutability or structured clone).

Dependency Injection:
- Prefer constructor injection for required dependencies.
- Use `inject()` only in functions or outside class constructors where DI context is present.
- Create explicit injection tokens for primitives (API_BASE_URL) rather than magic strings.

Routing:
- Keep route config flat; lazy-load feature areas with dynamic imports (loadComponent / loadChildren) when size grows.
- Avoid bloated root route definitions; extract feature route arrays.

Server State (TanStack Query):
- Define query keys centrally or via small helpers to avoid duplication.
- Co-locate query usage with components unless shared.
- Configure defaultOptions (staleTime, retry) globally in `app.config.ts`.
- Use mutations for writes; invalidate or update related queries explicitly.
- Use `withDevtools` only in dev mode (already implemented).

Forms:
- Use Reactive Forms for complex validation / dynamic structure.
- Use standalone directives (ngModel) only for simple controlled fields.
- Keep form model building logic in a factory or service if reused.

State vs Server State:
- Do NOT put remote cache data into a custom store; rely on TanStack Query caching.
- Use stores/elf or custom signals for UI state (e.g., theme, collapsed panels).

Styling:
- Prefer Tailwind utility classes; create small component styles only when duplication emerges.
- Leverage DaisyUI themes; adjust via data-theme attribute or root classes.

Error Handling:
- Fail fast for impossible states (throw in dev).
- Wrap network calls in thin adapter functions if cross-cutting logic (auth headers) is needed.

Accessibility:
- Use semantic HTML structure first.
- Avoid div-only component layouts; label interactive controls properly (aria-label etc.).

---

## 9. TESTING STRATEGY

Pyramid:
- Unit: Pure functions (adapters, helpers, transformations)
- Component: Behavior via DOM queries / user events (@testing-library/angular)
- Integration: Routing flows (narrow scope, keep fast)

Guidelines:
- One behavioral concept per test.
- Avoid brittle DOM structure assertions; prefer role, label, text queries.
- Mock network boundaries through test doubles, not global overrides.
- For TanStack Query tests, create a fresh QueryClient per test to avoid cache bleed.

Coverage:
- Target meaningful logic paths (branch conditions, error cases).
- Avoid chasing 100% artificially; prefer risk-based focus.

---

## 10. COMMIT DISCIPLINE

A commit is allowed only if (validated by `pnpm check:all`):
1. All tests pass (vitest).
2. Lint & formatting verification and type checks are clean.
3. Single logical concern (structural OR behavioral).
4. Message communicates intent (imperative).

`pnpm check:all` is the enforced gate; if it fails, fix issues before committing.

Examples:
- feat: add user profile route
- fix: handle 404 in user fetch
- refactor: extract query key helpers
- chore(structure): move auth service to feature folder
- test: add query invalidation tests
- docs: update Angular signal guidelines

---

## 11. REFACTORING GUIDELINES

Triggers:
- Duplication
- Poor naming / unclear intent
- Over-long function or component (multi responsibilities)
- Complex conditional logic (extract decisions)

Practice:
- Small steps; run tests after each.
- Mechanical transforms first (rename, extract).
- Remove dead code immediately.

---

## 12. CODE QUALITY STANDARDS

- Express domain intent over technical jargon.
- Avoid leaking implementation details across layers.
- Keep functions focused; prefer pure logic.
- Limit parameter lists (group into typed object only after pressure).
- Eliminate duplication before abstraction.
- No commented-out dead code; rely on VCS.

---

## 13. EXAMPLE RED → GREEN → REFACTOR MICRO-CYCLE (ANGULAR)

Scenario: Add theme persistence.

Red: Write test shouldReturnDefaultTheme().
Green: Hardcode 'light'.
Refactor: Introduce constant DEFAULT_THEME.
Red: Add test shouldPersistThemeAcrossReload().
Green: Implement localStorage read/write in a small `themeStorage` helper.
Refactor: Extract injection token THEME_STORAGE for future substitution; tests still pass.

---

## 14. EXAMPLE STRUCTURAL VS BEHAVIORAL SEQUENCE

Need to add query key helper module.

Structural: Extract duplicated inline arrays into queryKeys.ts returning typed tuples; run tests (no behavior change).
Behavioral: Introduce new `userPreferences` query keys and implement fetch + component consumption.
Refactor: Rename ambiguous key segments (info -> profile) for clarity.

---

## 15. NAMING & INTENT

Indicators of poor naming:
- Requires explanatory comment
- Generic (data, item, handle)
- Abbreviation losing clarity

Improve by:
- Using precise domain terminology (queryKey, sessionToken)
- Avoiding redundant suffixes (UserServiceService)

---

## 16. DECISION LOGGING (LIGHTWEIGHT)

For non-obvious tradeoffs add inline comment:
// Decision: Use signal instead of Observable to reduce template subscription complexity.

If cross-cutting, create short entry in a docs/decisions folder (future).

---

## 17. WORKFLOW CHECKLIST (QUICK START)

Before coding:
- Identify smallest behavioral slice.
- Decide if structural prep needed (Tidy First).

During cycle:
- Red? (failing test exists)
- Green? (minimal pass)
- Refactor? (improved structure, still green)

Before commit:
- Run `pnpm check:all` (must pass)
- Single concern
- Message categorized

After commit:
- Rebase if needed
- Plan next micro-step

---

## 18. WHEN TO INTRODUCE A STORE (ELF OR CUSTOM)

Introduce only if:
- Multiple distant components need synchronized writable state.
- Derived state would be recomputed expensively in each consumer.
- Cross-cutting caching or persistence semantics needed.

Otherwise prefer:
- Local component signals
- Input / Output (event emitter) chains for smaller propagations
- Simple service with signal fields for mid-level sharing

---

## 19. ERROR HANDLING

- Wrap external boundaries (HTTP, storage) in narrow services returning typed results (Result-like or union types).
- Surface loading / error / empty states explicitly in templates.
- Fail fast for logically impossible states (exhaustive guards).
- Log unexpected exceptions in dev; consider centralized handler later.

---

## 20. TOOLING HYGIENE

Primary gate:
- pnpm check:all (run before every commit)

During active development (fast loops):
- pnpm test --watch
- pnpm check (lint + type + format validation)
- pnpm test (single run)
- pnpm type-check (implicit via build if needed)

Recommended future CI steps:
- Install deps
- pnpm check:all
- Enforce coverage thresholds / quality gates

---

## 21. FUTURE EXTENSION SUGGESTIONS

- Route-level code splitting metrics & performance budget
- Preloading strategies for critical routes
- Storybook or similar for isolated component docs
- ADR folder for architectural decisions
- PWA enhancements (offline caching strategy)
- E2E tests (e.g., Playwright) once flows stabilize

---

## 22. COMMIT MESSAGE STYLE GUIDE

Format:
<type>(optional scope): imperative summary

Types:
- feat
- fix
- refactor
- chore(structure)
- test
- docs
- perf
- ci
- build

Bad: update stuff
Good: refactor: extract query key helpers

---

## 23. WHAT NOT TO DO

- Large feature branches without frequent merges
- Mixing feature development with sweeping renames
- Premature abstraction (avoid 1-off generic utilities)
- Ignoring failing tests during refactor
- Keeping stale commented code

---

## 24. ADAPTIVE EVOLUTION

Update this guide when:
- Repeated friction surfaces
- New framework feature adopted (e.g., enhanced Signals API)
- Tooling or best practices shift

Propose changes via docs-only PR with motivating examples.

---

## 25. QUICK REFERENCE (TL;DR)

Red: Small failing test  
Green: Minimal passing code  
Refactor: Improve structure without changing behavior  
Tidy First: Structural before behavioral  
Angular: Standalone components, signals, explicit DI  
Server State: TanStack Query (avoid duplicating cache)  
Client State: Signals first; escalate deliberately  
Testing: Behavior-focused, fast, isolated  
Commits: Single concern, clear intent  
MANDATORY: `pnpm check:all` passes before every commit

---

By following these principles the codebase remains approachable, performant, and adaptable.

See also: docs/query-key-helpers.md for standardized TanStack Query key helper conventions and templates.

(End of guide)