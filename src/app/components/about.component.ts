import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'About',
  templateUrl: './about.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
