import { signal } from '@angular/core'

/**
 * Simple counter store using Angular signals.
 *
 * Mirrors the shape of the SolidJS reference (decrease/increase/reset helpers),
 * adapted to Angular's fine-grained signal reactivity.
 */
export const counter = signal(0)

export function decreaseCounter(): void {
  counter.update((c) => c - 1)
}

export function increaseCounter(): void {
  counter.update((c) => c + 1)
}

export function resetCounter(): void {
  counter.set(0)
}
