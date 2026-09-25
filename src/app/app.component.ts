import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { RouterModule } from '@angular/router'
import { select } from '@ngneat/elf'

import { NavbarComponent } from './components/navbar.component'
import { THEMES, themeStore } from './stores/theme.store'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[linear-gradient(120deg,var(--color-base-100),var(--color-neutral))] p-3 sm:p-5">
      <div class="mx-auto max-w-8xl">
        <AppNavbar />
        <router-outlet />
      </div>
    </div>
  `,
  imports: [RouterModule, NavbarComponent],
})
export class AppComponent {
  title = 'ngDaisyUI'

  private readonly document = inject(DOCUMENT)
  private readonly theme = toSignal(themeStore.pipe(select((state) => state.theme)), {
    initialValue: { isDark: false },
  })

  constructor() {
    // Decision: effect instead of manual subscribe to avoid Subscription lifecycle.
    effect(() => {
      this.setTheme(this.theme()?.isDark)
    })
  }

  private setTheme(isDark?: boolean) {
    this.document.body.setAttribute('data-theme', isDark ? THEMES.DARK : THEMES.LIGHT)
  }
}
