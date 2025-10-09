# Decision Record 0001 – Adopt Zoneless Change Detection

Status: Accepted  
Date: 2025-10-09  
Owners: Engineering Team  
Version Affected: >= 0.3.x  
Related Guides: `AGENTS.md` (sections 8, 20), Signals usage patterns

---

## 1. Context

Historically Angular relied on Zone.js to monkey‑patch async APIs and trigger global change detection.  
With Angular 17–20 the framework matured a signals-based reactivity model and introduced **zoneless change detection** (`provideZonelessChangeDetection()`), reducing framework overhead and improving predictability.

This project already:
- Prefers fine‑grained reactive patterns (signals, TanStack Query).
- Uses standalone components with focused rendering.
- Aligns with performance + clarity goals stated in `AGENTS.md`.

We previously depended on the implicit async flush behavior of Zone.js in a limited fashion (mainly default CD). No deep Zone hooks, no Protractor, no legacy global patterns were in use.

---

## 2. Problem / Forces

| Force | Details |
|-------|---------|
| Performance & determinism | Zone’s global patching adds overhead and obscures when & why change detection runs. |
| Mental model simplicity | Signals provide explicit reactivity; continuing Zone.js is redundant. |
| Test stability | Tests occasionally rely on implicit async settling; explicit signal updates are clearer. |
| Ecosystem readiness | Modern Angular + common libs (TanStack Query, Testing Library) work without Zone.js. |
| Risk | Any 3rd‑party lib that *implicitly* counted on Zone-triggered CD might not update the view. |

---

## 3. Decision

Adopt **zoneless change detection** across the application by:
1. Adding `provideZonelessChangeDetection()` to `app.config.ts`.
2. Removing `"zone.js"` from the polyfills array in `angular.json`.
3. (Planned follow-up) Remove the `zone.js` dependency from `package.json` after verification.
4. Adjust tests (if needed) to avoid Zone-specific utilities (`whenStable`, implicit microtask flush assumptions).

---

## 4. Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Keep Zone.js | Zero migration risk; status quo | Extra runtime cost; obscured reactivity; dual paradigms signals + zone |
| Partial (feature modules only) | Incremental | Inconsistent mental model; marginal benefit |
| Full zoneless (chosen) | Consistent explicit model; perf & clarity; future-aligned | Need to audit async boundaries |
| Hybrid + manual CD tweaks | Fine control | Higher maintenance; accidental complexity |

---

## 5. Consequences

### Positive
- Reduced cognitive load: UI updates tied to explicit signal mutations or Observable emissions.
- Potentially lower change detection churn.
- Clearer test semantics (await explicit conditions, not framework magic).
- Future-proofing: aligns with Angular’s direction and community shift.

### Negative / Risks
- Hidden assumptions: Any lingering imperative async callback that *mutates non-reactive state* won’t re-render.
- Onboarding: Contributors must know to *always* mutate signals (or call `markForCheck()` as a last resort).
- Library edge cases: Rare libs expecting zone task tracking may degrade (none identified yet).

---

## 6. Mitigations

| Risk | Mitigation |
|------|------------|
| Missed UI updates | Enforce signals for component state; lint review during PR. |
| Test flakiness | Prefer Testing Library `findBy*` / `waitFor` over `whenStable()`. |
| 3rd-party breakage | Keep rollback path (reintroduce zone polyfill + remove provider) until next minor release. |
| Silent object mutation | Promote immutable updates (`signal.update(() => ({ ...prev, changed }))`). |

---

## 7. Migration Summary (Executed)

1. Added `provideZonelessChangeDetection()` in `app.config.ts`.
2. Cleared `"polyfills": []` in `angular.json` (removed `"zone.js"` entry).
3. Confirmed build & initial smoke tests run.
4. Pending: Remove `zone.js` from `package.json` (no direct dependency currently present—verified).

---

## 8. Rollback Plan

If a blocking issue surfaces:
1. Re-add `"zone.js"` to `angular.json` polyfills.
2. Remove `provideZonelessChangeDetection()` provider.
3. (If previously removed) Reinstall `zone.js` dependency: `pnpm add zone.js`.
Rollback is isolated to a single provider + polyfill line; no cascading file changes.

---

## 9. Testing Adjustments

- Prefer: `await screen.findByText(/.../)` instead of `fixture.whenStable()`.
- For manual signal writes in tests: call `fixture.detectChanges()` only if template observation lags (typically unnecessary; signals propagate automatically in test environment).
- Avoid brittle timing: use `await waitFor(() => expect(...))`.

---

## 10. Guidelines Going Forward

DO:
- Use signals (`signal()`, `computed()`) for any component state that drives the template.
- Wrap external callback APIs so they update signals.
- Use Observables only where streaming semantics add clarity; convert to signal near the template if desired.

AVOID:
- Mutating plain class fields and expecting a render.
- Directly mutating nested objects inside a signal value without reassigning.
- Reintroducing Zone dependencies for convenience.

---

## 11. Monitoring / Validation

Short term:
- Manual QA of async-heavy flows (user interactions, delayed fetch states).
- Watch for issues labeled `ui-not-updating` or `stale-view`.

Long term:
- Consider adding a lightweight runtime dev assertion helper that warns if a non-signal state field changes without a render (optional future enhancement).

---

## 12. Future Enhancements

- Explore perf instrumentation comparing CD cycles pre/post (if regression suspicion arises).
- Codemod or lint rule to flag `whenStable()` or zone-dependent utilities if they reappear.
- Document a pattern library entry: “Async integration boundary examples (FileReader, setTimeout, custom events)”.

---

## 13. References

- Angular Docs: Zoneless & Signals Change Detection (Angular 20).
- Internal Guide: `AGENTS.md` (Sections 8: Change Detection & Performance).
- TanStack Query – Signal interoperability (cache updates trigger signal-driven renders).

---

## 14. Decision Snapshot (TL;DR)

We removed Zone.js and now rely solely on signals + explicit reactivity for change detection. This simplifies the mental model, aligns with modern Angular direction, and reduces hidden global patches. Risks are low and rollback is trivial.

---

(End of record)