import { Component, inject } from '@angular/core';

import { CountryService } from '../services/country.service';
import { CountryCardComponent } from './country-card.component';

@Component({
  selector: 'Country',
  templateUrl: './country.component.html',
  imports: [CountryCardComponent],
  standalone: true
})
export class CountryComponent {
  result = inject(CountryService).getCountries().result;
}
