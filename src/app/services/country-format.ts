import type { Country } from './country.service'

export function firstValue(values?: Record<string, string>): string | undefined {
  return Object.values(values ?? {})[0]
}

export function countryCapitals(country: Pick<Country, 'capital'>): string[] {
  return Array.isArray(country.capital) ? (country.capital ?? []) : []
}

export function countryRegionLabel(country: Pick<Country, 'subregion' | 'region' | 'continents'>): string {
  return country.subregion ?? country.region ?? country.continents.join(', ')
}

export function populationDensity(country: Pick<Country, 'population' | 'area'>): string {
  if (!country.area) return 'N/A'
  return `${Math.round(country.population / (country.area ?? 1)).toLocaleString()}/km²`
}

export function countryAreaLabel(country: Pick<Country, 'area'>): string {
  return country.area ? `${country.area?.toLocaleString()} km²` : 'N/A'
}
