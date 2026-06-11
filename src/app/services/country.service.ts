import { HttpClient } from '@angular/common/http'
import { inject, Service } from '@angular/core'
import { lastValueFrom } from 'rxjs'

export interface Country {
  name: {
    common?: string
    official: string
  }
  capital?: string[]
  population: number
  area?: number
  continents: string[]
  region?: string
  subregion?: string
  cca3?: string
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  independent?: boolean
  unMember?: boolean
  flags: {
    svg: string
    alt?: string
  }
}

interface CountryDatasetRecord {
  name?: {
    common?: string
    official?: string
  }
  capital?: string[]
  population?: number
  area?: number
  region?: string
  subregion?: string
  cca2?: string
  cca3?: string
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  independent?: boolean
  unMember?: boolean
}

const countriesDatasetUrl = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'

@Service()
export class CountryService {
  #http = inject(HttpClient)

  async getCountries(): Promise<Country[]> {
    const countries = await lastValueFrom(this.#http.get<unknown>(countriesDatasetUrl))

    if (!Array.isArray(countries)) {
      throw new Error('Expected countries dataset to return an array')
    }

    return countries.map((country) => this.toCountry(country as CountryDatasetRecord))
  }

  private toCountry(country: CountryDatasetRecord): Country {
    const commonName = country.name?.common ?? country.name?.official ?? 'Unknown country'
    const officialName = country.name?.official ?? commonName
    const countryCode = country.cca2?.toLowerCase()

    return {
      name: {
        common: commonName,
        official: officialName,
      },
      capital: country.capital,
      population: country.population ?? 0,
      area: country.area,
      continents: country.region ? [country.region] : [],
      region: country.region,
      subregion: country.subregion,
      cca3: country.cca3,
      languages: country.languages,
      currencies: country.currencies,
      independent: country.independent,
      unMember: country.unMember,
      flags: {
        svg: countryCode ? `https://flags.restcountries.com/v5/svg/${countryCode}.svg` : '',
        alt: `Flag of ${commonName}`,
      },
    }
  }
}
