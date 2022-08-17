import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountryService } from '../services/country.service';
import { CountryCardComponent } from './country-card.component';

@Component({
  selector: 'Country',
  templateUrl: './country.component.html',
  imports: [NgForOf, CountryCardComponent],
  standalone: true
})
export class CountryComponent {
  countries: any;
  countrySubscription: Subscription = new Subscription();

  constructor(private service: CountryService) {}

  ngOnInit() {
    this.countrySubscription = this.service.getCountries().subscribe((r: any) => (this.countries = r));
  }

  ngDestory() {
    this.countrySubscription.unsubscribe();
  }
}
