import { describe, expect, it } from 'vitest'
import type { Country } from './country.service'
import { countryAreaLabel, countryCapitals, countryRegionLabel, firstValue, populationDensity } from './country-format'

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

describe('countryRegionLabel', () => {
  it('prefers subregion, then region, then continents', () => {
    expect(countryRegionLabel(makeCountry({ subregion: 'Eastern Asia', region: 'Asia', continents: ['Asia'] }))).toBe(
      'Eastern Asia',
    )
    expect(countryRegionLabel(makeCountry({ region: 'Asia', continents: ['Asia'] }))).toBe('Asia')
    expect(countryRegionLabel(makeCountry({ continents: ['Asia', 'Oceania'] }))).toBe('Asia, Oceania')
  })
})

describe('populationDensity', () => {
  it('returns N/A without area', () => {
    expect(populationDensity(makeCountry({ population: 100, area: undefined }))).toBe('N/A')
  })

  it('formats people per km²', () => {
    expect(populationDensity(makeCountry({ population: 1000, area: 500 }))).toBe('2/km²')
  })
})

describe('countryAreaLabel', () => {
  it('returns N/A without area', () => {
    expect(countryAreaLabel(makeCountry({ area: undefined }))).toBe('N/A')
  })

  it('formats km² with grouping', () => {
    expect(countryAreaLabel(makeCountry({ area: 377975 }))).toBe('377,975 km²')
  })
})
