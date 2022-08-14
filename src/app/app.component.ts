import { DOCUMENT, NgForOf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { select } from '@ngneat/elf';
import { Subscription } from 'rxjs';
import { CountryCardComponent } from './components/country-card.component';
import { NavbarComponent } from './components/navbar.component';
import { CountryService } from './services/country.service';
import { THEMES, themeStore } from './stores/theme.store';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [NgForOf, NavbarComponent, CountryCardComponent],
	standalone: true
})
export class AppComponent {
	title = 'ngDaisyUI';

	countries: any;
	theme = 'dawn';
	themeSubscription: Subscription = new Subscription();
	countrySubscription: Subscription = new Subscription();

	constructor(@Inject(DOCUMENT) private document: Document, private service: CountryService) {}

	ngOnInit() {
		this.themeSubscription = themeStore.pipe(select(state => state.theme)).subscribe(s => this.setTheme(s?.isDark));
		this.countrySubscription = this.service.getCountries().subscribe(r => (this.countries = r));
	}

	ngDestory() {
		this.themeSubscription.unsubscribe();
		this.countrySubscription.unsubscribe();
	}

	private setTheme(isDark?: boolean) {
		document.body.setAttribute('data-theme', isDark ? THEMES.DARK : THEMES.LIGHT);
	}
}
