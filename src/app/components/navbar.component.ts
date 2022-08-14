import { ChangeDetectionStrategy, Component } from '@angular/core';
import { themeStore } from '../stores/theme.store';

@Component({
	selector: 'AppNavbar',
	templateUrl: './navbar.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
	toggleTheme() {
		themeStore.update(state => ({
			...state,
			theme: { isDark: !state.theme?.isDark }
		}));
	}
}
