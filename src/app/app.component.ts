import { Component, DOCUMENT, Inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { select } from '@ngneat/elf'
import { Subscription } from 'rxjs'

import { NavbarComponent } from './components/navbar.component'
import { THEMES, themeStore } from './stores/theme.store'

@Component({
  selector: 'app-root',
  standalone: true,
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

  theme = 'dark'
  themeSubscription: Subscription = new Subscription()

  constructor(@Inject(DOCUMENT) _document: Document) {}

  ngOnInit() {
    this.themeSubscription = themeStore.pipe(select((state) => state.theme)).subscribe((s) => this.setTheme(s?.isDark))
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe()
  }

  private setTheme(isDark?: boolean) {
    document.body.setAttribute('data-theme', isDark ? THEMES.DARK : THEMES.LIGHT)
  }
}
