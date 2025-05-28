import { Component, DOCUMENT, Inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { select } from '@ngneat/elf'
import { Subscription } from 'rxjs'

import { NavbarComponent } from './components/navbar.component'
import { THEMES, themeStore } from './stores/theme.store'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule, NavbarComponent],
})
export class AppComponent {
  title = 'ngDaisyUI'

  theme = 'dark'
  themeSubscription: Subscription = new Subscription()

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.themeSubscription = themeStore.pipe(select((state) => state.theme)).subscribe((s) => this.setTheme(s?.isDark))
  }

  ngDestory() {
    this.themeSubscription.unsubscribe()
  }

  private setTheme(isDark?: boolean) {
    document.body.setAttribute('data-theme', isDark ? THEMES.DARK : THEMES.LIGHT)
  }
}
