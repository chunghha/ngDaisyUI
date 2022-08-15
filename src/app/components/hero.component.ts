import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'Hero',
	templateUrl: './hero.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {}
