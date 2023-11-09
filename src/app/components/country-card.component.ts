import { Component, Input } from '@angular/core';

@Component({
  selector: 'CountryCard',
  templateUrl: './country-card.component.html',
  standalone: true
})
export class CountryCardComponent {
  @Input() country: any;
}
