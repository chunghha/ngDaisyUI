import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'About',
  template: `
    <div class="min-h-screen">
      <p class="text-inter p-8 text-center">
        This is an Angular demo that uses the Country API.
      </p>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
