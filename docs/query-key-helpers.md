# Query Key Helper Guide (Angular + TanStack Query)

This document defines conventions and a template for constructing strongly typed, centralized TanStack Query keys in this Angular project.

---

## Goals

- Eliminate ad-hoc inline array literals
- Standardize key segment ordering
- Enable safe refactors (rename a segment in one place)
- Provide discoverability / autocomplete
- Reduce accidental cache collisions

---

## Why Centralize Keys?

Inline arrays like `['user', id]` inevitably diverge (ordering, naming, segment meaning). Central helpers:

- Prevent subtle mismatches (e.g., `user` vs `users`)
- Encourage intentional broad vs precise invalidations
- Provide typed tuple literals (`as const`) for proper narrowing
- Make testing + refactoring easier

---

## Core Principles

1. Domain First: First segment is the domain noun (`'user'`, `'theme'`, `'project'`).
2. Stable Ordering: domain → sub-scope → identifiers → filters/variants.
3. Primitive Segments: Favor strings / numbers / booleans; avoid whole objects.
4. Explicit Fallbacks: Use explicit primitive placeholders like `'all'` or `'any'` instead of `undefined`.
5. Literal Fidelity: Return tuples with `as const` for literal type inference.
6. Identity Only: Keys describe data identity, not ephemeral UI state.
7. Pure Functions: Helpers are pure, side-effect free.

---

## File Location

Create / maintain a single aggregation file:

`src/app/query-keys.ts`

If growth demands separation, group per feature and re-export through this file.

---

## Template

```src/app/query-keys.ts#L1-90
// Centralized query key helper utilities.
// Pattern: Each domain has a helper object with small pure functions returning typed tuple literals.

// USER KEYS ------------------------------------------------------------------
export const userKeys = {
  root: () => ['user'] as const,
  list: (filters?: { active?: boolean }) =>
    ['user', 'list', filters?.active ?? 'all'] as const,
  detail: (id: string) => ['user', 'detail', id] as const,
  preferences: (id: string) => ['user', 'preferences', id] as const,
};

// THEME KEYS -----------------------------------------------------------------
export const themeKeys = {
  root: () => ['theme'] as const,
  current: () => ['theme', 'current'] as const,
};

// (EXAMPLE) PROJECT KEYS -----------------------------------------------------
export const projectKeys = {
  root: () => ['project'] as const,
  list: (status?: 'active' | 'archived') =>
    ['project', 'list', status ?? 'all'] as const,
  detail: (id: string) => ['project', 'detail', id] as const,
};

// AGGREGATION ----------------------------------------------------------------
export const queryKeys = {
  user: userKeys,
  theme: themeKeys,
  project: projectKeys,
};

// USAGE EXAMPLE (inside injectQuery()):
// const userId = signal('123');
// const userDetailQuery = injectQuery(() => ({
//   queryKey: userKeys.detail(userId()),
//   queryFn: () => http.get<User>(`/api/users/${userId()}`),
// }));
//
// INVALIDATION EXAMPLES:
// qc.invalidateQueries({ queryKey: userKeys.detail(userId()) });         // precise
// qc.invalidateQueries({ queryKey: userKeys.root() });                  // domain-wide
// qc.invalidateQueries({ queryKey: userKeys.preferences(userId()).slice(0, 3) });
// Slice pattern broadens scope to ['user','preferences'] (all prefs).
//
// ADD NEW DOMAIN: replicate pattern (see guide documentation).
```

---

## Naming Conventions

| Pattern      | Example                                | Notes                                  |
|--------------|----------------------------------------|----------------------------------------|
| `root`       | `userKeys.root()`                      | Top-level domain                       |
| `list`       | `userKeys.list({ active: true })`      | Collections w/ primitive filter tail   |
| `detail`     | `userKeys.detail(id)`                  | Singular resource                      |
| `preferences`| `userKeys.preferences(id)`             | Resource facet                         |
| `current`    | `themeKeys.current()`                  | Singleton derived state                |

Prefer singular domain root unless a plural word is truly canonical.

---

## Do / Don't

Do:
- `['user','detail',id]`
- `['project','list','all']`
- `['theme','current']`

Don’t:
- `['user', { id }]` (object segment)
- Mix `['users', id]` and `['user', id]`
- `['user','detail', id, { active: true }]` (object tail)

---

## Invalidation Strategy

Choose minimal necessary scope:

| Scope        | Example                                                                 |
|--------------|-------------------------------------------------------------------------|
| Precise      | `qc.invalidateQueries({ queryKey: userKeys.detail(id) })`               |
| Facet        | `qc.invalidateQueries({ queryKey: userKeys.preferences(id).slice(0, 3) })` |
| Domain-wide  | `qc.invalidateQueries({ queryKey: userKeys.root() })`                   |

Prefer precise invalidation unless multiple records actually changed.

---

## Migrating Existing Inline Keys

1. Grep for inline literals like `['user'`.
2. Replace with helper calls.
3. Run tests.
4. If a pattern does not fit, extend the helper (avoid more inline arrays).
5. Commit as `chore(structure): migrate user query keys`.

---

## Type Safety Tips

- `as const` ensures literal tuple types (good for narrowing).
- Avoid dynamic string concatenation inside keys.
- Decompose filter objects into stable primitive segments (e.g., `status ?? 'all'`).

---

## Step-by-Step: Adding a New Domain (Extended)

Scenario: Introduce "project" domain with list & detail plus filtered list (by status).

1. Define helper object:

```/dev/null/project-keys-snippet.ts#L1-15
export const projectKeys = {
  root: () => ['project'] as const,
  list: (status?: 'active' | 'archived') =>
    ['project', 'list', status ?? 'all'] as const,
  detail: (id: string) => ['project', 'detail', id] as const,
};
```

2. Aggregate:
   - Add to `queryKeys` export: `project: projectKeys`.

3. Use in data fetching:

```/dev/null/project-query-usage.ts#L1-18
const status = signal<'active' | 'archived' | undefined>(undefined);

const projectsQuery = injectQuery(() => ({
  queryKey: projectKeys.list(status()),
  queryFn: () =>
    http.get<Project[]>(`/api/projects`, {
      params: status() ? { status: status() } : {},
    }),
  staleTime: 5 * 60 * 1000,
}));
```

4. Add mutation invalidation:

```/dev/null/project-mutation.ts#L1-20
const qc = inject(QueryClient);

const createProject = injectMutation(() => ({
  mutationFn: (dto: CreateProjectDto) => http.post('/api/projects', dto),
  onSuccess: () => {
    // Broad refresh (all statuses):
    qc.invalidateQueries({ queryKey: projectKeys.list() });
    // Or precise status refresh:
    // qc.invalidateQueries({ queryKey: projectKeys.list('active') });
  },
}));
```

5. Tests:
   - Unit: each helper returns expected tuple.
   - Integration: mutation invalidates list query.
   - Optional: ensure status change triggers new key and refetch.

6. Replace any inline `['project', ...]` arrays with helper usage.

7. Commit:
   - `feat: add project query keys and list/detail queries`

8. (Optional) Document special invalidation rules (e.g., large dataset partial refresh strategy) here or in a decisions doc.

---

## Advanced Patterns

| Pattern            | Description                                           | Example                                                   |
|--------------------|-------------------------------------------------------|-----------------------------------------------------------|
| Param Decomposition| Break filter objects into primitives                  | `['user','list', page, pageSize]`                         |
| Versioning         | Add early version segment when schema differs         | `['report','v2','detail', id]`                            |
| Multi-Tenancy      | Include tenant context early                          | `['tenant', tenantId, 'user','list','all']`               |
| Pagination         | Keep paging segments at tail                          | `['project','list','active', page, pageSize]`             |

---

## Anti-Patterns

- Over-segmentation: `['user','detail','entity','record', id]`
- UI state leakage: `['user','list','modalOpen']`
- Object segments: `['user',{ id, tab }]`
- Hidden serialization hacks (stringified JSON objects)

---

## Tooling Ideas (Future)

- ESLint rule disallowing inline array literals for known domains.
- Codemod to convert raw arrays to helper calls.
- Unit tests auto-generating snapshot of all keys (sanity list).

---

## Checklist for Every New Key Function

- [ ] Returns tuple literal with `as const`
- [ ] Uses stable primitive segments
- [ ] Ordering: domain → sub-scope → identifiers → filters
- [ ] No UI / ephemeral state
- [ ] Clear, intention-revealing name

---

## Summary

Centralized, typed query key helpers reduce risk, improve discoverability, and make cache invalidation intentional. Adopt the template, migrate incrementally, and avoid reintroducing inline literals once a helper exists.

(End of guide)