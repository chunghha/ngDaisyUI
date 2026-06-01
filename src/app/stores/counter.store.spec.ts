import { beforeEach, describe, expect, it } from 'vitest'
import { counter, decreaseCounter, increaseCounter, resetCounter } from './counter.store'

describe('counter store', () => {
  beforeEach(() => {
    resetCounter()
  })

  it('should have initial count of 0', () => {
    expect(counter()).toBe(0)
  })

  it('should increase count by 1', () => {
    increaseCounter()
    expect(counter()).toBe(1)
  })

  it('should decrease count by 1', () => {
    decreaseCounter()
    expect(counter()).toBe(-1)
  })

  it('should reset count back to 0 after changes', () => {
    increaseCounter()
    increaseCounter()
    increaseCounter()
    expect(counter()).toBe(3)

    resetCounter()
    expect(counter()).toBe(0)
  })

  it('should support increase then decrease cycles', () => {
    increaseCounter()
    increaseCounter()
    expect(counter()).toBe(2)

    decreaseCounter()
    decreaseCounter()
    expect(counter()).toBe(0)
  })
})
