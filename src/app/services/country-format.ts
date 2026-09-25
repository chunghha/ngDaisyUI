import type { Country } from './country.service'

export function firstValue(values?: Record<string, string>): string | undefined {
  return Object.values(values ?? {})[0]
}

export function countryCapitals(country: Pick<Country, 'capital'>): string[] {
  return Array.isArray(country.capital) ? (country.capital ?? []) : []
}
