import { Component, inject } from '@angular/core'
import { injectQuery } from '@tanstack/angular-query-experimental'
import { broaden } from '../query-keys'
import { CountryService } from '../services/country.service'
import { CountryCardComponent } from './country-card.component'

/**
 * Exported for reuse in tests and potential other modules so we avoid
 * duplicating the literal countries query key.
 */
export const COUNTRIES_QUERY_KEY = broaden(['countries'] as const, 1)

/**
 * Pure helper that builds the TanStack Query config for countries.
 * This is unit-testable without rendering an Angular component.
 */
export function buildCountriesQuery(countryService: CountryService) {
  return {
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: () => countryService.getCountries(),
  }
}

@Component({
  selector: 'Country',
  standalone: true,
  template: `
    <div class="bg-gradient-to-r from-base-100 to-neutral">
      <div class="max-w-8xl mx-auto pt-2 pr-2 pb-8 pl-2">
        <div
          class="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          @for (country of query.data(); track $index) {
            <CountryCard [country]="country" />
          }
        </div>
      </div>
    </div>
  `,
  imports: [CountryCardComponent],
})
export class CountryComponent {
  #countryService = inject(CountryService)

  query = injectQuery(() => buildCountriesQuery(this.#countryService))
}
