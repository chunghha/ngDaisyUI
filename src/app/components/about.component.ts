import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BreakpointComponent } from './breakpoint.component'

@Component({
  selector: 'About',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen">
      <p class="text-inter p-8 text-center">
        This is an Angular demo that uses the Country API.
      </p>
      <div class="mt-4">
        <Breakpoint />
      </div>
    </div>
  `,
  imports: [BreakpointComponent],
})
export class AboutComponent {}
