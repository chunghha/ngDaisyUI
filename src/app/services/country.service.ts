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
  flags: {
    svg: string
    alt?: string
  }
}

const enrichedCountryFields = 'flags,name,capital,population,area,continents,region,subregion,cca3,languages'
const baseCountryFields = 'flags,name,capital,population,continents,region,subregion'

@Service()
export class CountryService {
  #http = inject(HttpClient)

  async getCountries(): Promise<Country[]> {
    try {
      return await this.fetchCountryFields(enrichedCountryFields)
    } catch (_error) {
      return this.fetchCountryFields(baseCountryFields)
    }
  }

  private async fetchCountryFields(fields: string): Promise<Country[]> {
    const countries = await lastValueFrom(
      this.#http.get<unknown>(`https://restcountries.com/v3.1/all?fields=${fields}`),
    )

    if (!Array.isArray(countries)) {
      throw new Error('Expected countries API to return an array')
    }

    return countries as Country[]
  }
}
