/**
 * Barrel exports for shared application utilities.
 *
 * Currently focused on TanStack Query key helpers & related utilities.
 *
 * Import from this barrel to keep import sites stable as internals evolve:
 *   import { userKeys, queryKeys, keyStartsWith, broaden, AnyQueryKey } from './app';
 *
 * NOTE:
 * Keep this file side‑effect free (only type/value exports) to preserve
 * optimal tree-shaking in production builds.
 */

// Re-export individual helpers (explicit for clarity / future auditability)
export {
  type AnyQueryKey,
  broaden,
  keyStartsWith,
  projectKeys,
  queryKeys,
  themeKeys,
  userKeys,
} from './query-keys'

// (Add future shared exports below, grouping by concern with header comments)
// Example placeholders (uncomment when implemented):
// export * from './services/api';
// export * from './stores/theme.store';
