/**
 * Centralized TanStack Query key helper utilities.
 *
 * Goals:
 * - Eliminate ad‑hoc inline array literals
 * - Provide stable, typed, intention‑revealing query keys
 * - Make invalidation expressive (precise vs facet vs domain)
 *
 * Conventions:
 * domain → sub-scope → identifiers → filters/variants
 *
 * Each helper returns a tuple literal (with `as const`) to preserve literal types.
 *
 * IMPORTANT:
 * Never put ephemeral UI state or entire objects into a key segment.
 * Prefer primitive segments (string | number | boolean) and explicit fallbacks like 'all' or 'any'.
 */

/* -------------------------------------------------------------------------- */
/*  Generic Helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Utility type representing any query key tuple.
 * (Alias kept local to avoid accidental widening.)
 */
export type AnyQueryKey = readonly unknown[]

/**
 * Return true if a key starts with a given prefix (segment-wise).
 * Useful for broader matching or crafting custom invalidation logic.
 */
export function keyStartsWith(key: AnyQueryKey, prefix: AnyQueryKey): boolean {
  if (prefix.length > key.length) return false
  for (let i = 0; i < prefix.length; i++) {
    if (key[i] !== prefix[i]) return false
  }
  return true
}

/**
 * Creates a *broadened* prefix from a full key by truncating trailing segments.
 * Example: broaden(userKeys.detail('abc'), 2) => ['user','detail']
 */
export function broaden<T extends AnyQueryKey>(key: T, keep: number): AnyQueryKey {
  return key.slice(0, keep)
}

/* -------------------------------------------------------------------------- */
/*  USER KEYS                                                                 */
/* -------------------------------------------------------------------------- */

export const userKeys = {
  /**
   * Domain root – invalidate to refresh all user-related queries.
   * ['user']
   */
  root: () => ['user'] as const,

  /**
   * User list with optional active filter.
   * ['user','list','all' | boolean]
   */
  list: (filters?: { active?: boolean }) => ['user', 'list', filters?.active ?? 'all'] as const,

  /**
   * Specific user detail.
   * ['user','detail', <id>]
   */
  detail: (id: string) => ['user', 'detail', id] as const,

  /**
   * User preferences facet.
   * ['user','preferences', <id>]
   */
  preferences: (id: string) => ['user', 'preferences', id] as const,
}

/* -------------------------------------------------------------------------- */
/*  THEME KEYS                                                                */
/* -------------------------------------------------------------------------- */

export const themeKeys = {
  /**
   * Theme domain root.
   */
  root: () => ['theme'] as const,

  /**
   * Currently active theme variant (singleton).
   */
  current: () => ['theme', 'current'] as const,
}

/* -------------------------------------------------------------------------- */
/*  PROJECT KEYS (Example Domain)                                             */
/* -------------------------------------------------------------------------- */

export const projectKeys = {
  /**
   * Project domain root.
   */
  root: () => ['project'] as const,

  /**
   * Project list filtered by status.
   * ['project','list','all' | 'active' | 'archived']
   */
  list: (status?: 'active' | 'archived') => ['project', 'list', status ?? 'all'] as const,

  /**
   * Specific project detail.
   * ['project','detail', <id>]
   */
  detail: (id: string) => ['project', 'detail', id] as const,
}

/* -------------------------------------------------------------------------- */
/*  AGGREGATION                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Aggregated export for ergonomic grouped access & discoverability.
 */
export const queryKeys = {
  user: userKeys,
  theme: themeKeys,
  project: projectKeys,
}

/* -------------------------------------------------------------------------- */
/*  INVALIDATION EXAMPLES (Reference Only)                                    */
/* -------------------------------------------------------------------------- */
/*
import { inject } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';

const qc = inject(QueryClient);
const userId = 'abc123';

// Precise invalidation (just that user detail)
qc.invalidateQueries({ queryKey: userKeys.detail(userId) });

// Facet invalidation (all user preferences)
qc.invalidateQueries({ queryKey: broaden(userKeys.preferences(userId), 2) }); // ['user','preferences']

// Domain-wide invalidation (all user queries)
qc.invalidateQueries({ queryKey: userKeys.root() });

// Theme current value
qc.invalidateQueries({ queryKey: themeKeys.current() });
*/

/* -------------------------------------------------------------------------- */
/*  TEST EXAMPLES (Vitest)                                                    */
/*  (Create a file like: src/app/query-keys.test.ts)                          */
/* -------------------------------------------------------------------------- */
/*
import { describe, it, expect } from 'vitest';
import { userKeys, themeKeys, projectKeys, keyStartsWith, broaden } from './query-keys';

describe('query-keys', () => {
  it('user detail key literal structure', () => {
    const k = userKeys.detail('u1');
    expect(k).toEqual(['user', 'detail', 'u1']);
  });

  it('list filter fallback', () => {
    expect(userKeys.list()).toEqual(['user','list','all']);
    expect(userKeys.list({ active: true })).toEqual(['user','list', true]);
  });

  it('keyStartsWith works for facet check', () => {
    const full = userKeys.preferences('u1');
    const facet = broaden(full, 2); // ['user','preferences']
    expect(keyStartsWith(full, facet)).toBe(true);
  });

  it('theme current key stable', () => {
    const a = themeKeys.current();
    const b = themeKeys.current();
    expect(a).toEqual(b);
  });

  it('project list status variant', () => {
    expect(projectKeys.list()).toEqual(['project','list','all']);
    expect(projectKeys.list('active')).toEqual(['project','list','active']);
  });
});
*/

/* -------------------------------------------------------------------------- */
/*  SAFETY / MAINTENANCE CHECKLIST                                            */
/* -------------------------------------------------------------------------- */
/*
For every new domain:
1. Add <domain>Keys with root() plus specific scopes (list/detail/facets).
2. Use explicit primitive placeholders for filters (e.g., 'all', 'any').
3. Return tuple literals with `as const`.
4. Add to aggregated `queryKeys`.
5. Replace any inline arrays for that domain.
6. Add unit tests verifying:
   - Structural equality for representative keys.
   - Broad invalidation prefix logic if applicable (using broaden / keyStartsWith).
7. Commit as chore(structure) or feat depending on behavior introduction.
*/

/* -------------------------------------------------------------------------- */
/*  END                                                                       */
/* -------------------------------------------------------------------------- */
