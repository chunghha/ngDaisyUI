import { Component } from '@angular/core';
import { CountryService } from './services/country.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
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
