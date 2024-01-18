import { Component, inject } from '@angular/core'

import { injectQuery } from '@tanstack/angular-query-experimental'
import { CountryService } from '../services/country.service'
import { CountryCardComponent } from './country-card.component'

@Component({
  selector: 'Country',
  templateUrl: './country.component.html',
  imports: [CountryCardComponent],
  standalone: true,
})
export class CountryComponent {
  #countryService = inject(CountryService)

  query = injectQuery(() => ({
    queryKey: ['countries'],
    queryFn: () => this.#countryService.getCountries(),
  }))
}
