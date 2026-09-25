import { describe, expect, it } from 'vitest'
import type { Country } from './country.service'
import { countryCapitals, firstValue } from './country-format'

function makeCountry(overrides: Partial<Country> = {}): Country {
  return {
    name: { official: 'Testland' },
    population: 0,
    continents: [],
    flags: { svg: '' },
    ...overrides,
  }
}

describe('firstValue', () => {
  it('returns undefined for missing or empty input', () => {
    expect(firstValue(undefined)).toBeUndefined()
    expect(firstValue({})).toBeUndefined()
  })

  it('returns the first language value', () => {
    expect(firstValue({ jpn: 'Japanese', eng: 'English' })).toBe('Japanese')
  })
})

describe('countryCapitals', () => {
  it('returns empty array when capital is missing', () => {
    expect(countryCapitals(makeCountry({ capital: undefined }))).toEqual([])
  })

  it('returns capitals when present', () => {
    expect(countryCapitals(makeCountry({ capital: ['Tokyo'] }))).toEqual(['Tokyo'])
  })
})
