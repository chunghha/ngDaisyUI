import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { CountryCardComponent } from './components/country-card.component';
import { NavbarComponent } from './components/navbar.component';
import { CountryService } from './services/country.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [NgForOf, NavbarComponent, CountryCardComponent],
	standalone: true
})
export class AppComponent {
	title = 'ngDaisyUI';

	countries: any;

	constructor(private service: CountryService) {}

	ngOnInit() {
		this.service.getCountries().subscribe(res => {
			this.countries = res;
		});
	}
}
