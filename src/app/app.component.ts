import { DOCUMENT, NgForOf } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { select } from '@ngneat/elf'
import { Subscription } from 'rxjs'

import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental'
import { NavbarComponent } from './components/navbar.component'
import { THEMES, themeStore } from './stores/theme.store'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule, NgForOf, NavbarComponent, AngularQueryDevtools],
  standalone: true,
})
export class AppComponent {
  title = 'ngDaisyUI'

  theme = 'dawn'
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
