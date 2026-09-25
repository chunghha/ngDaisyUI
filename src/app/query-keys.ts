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
/*  COUNTRY KEYS                                                              */
/* -------------------------------------------------------------------------- */

export const countryKeys = {
  /**
   * Country domain root – invalidate to refresh all country queries.
   * ['countries']
   */
  root: () => ['countries'] as const,

  /**
   * Country list with continent and search variants.
   * ['countries','list',<continent|all>,<search|all>]
   */
  list: (filters?: { continent?: string; search?: string }) =>
    ['countries', 'list', filters?.continent ?? 'all', filters?.search ?? 'all'] as const,
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
  country: countryKeys,
}

// See docs/query-key-helpers.md for invalidation patterns and per-domain checklists.
