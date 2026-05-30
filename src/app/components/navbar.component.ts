import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterModule } from '@angular/router'

import { themeStore } from '../stores/theme.store'

@Component({
  selector: 'AppNavbar',
  standalone: true,
  template: `
    <div class="navbar sticky top-4 z-50 mb-4 rounded-full border border-base-content/10 bg-base-100/80 px-4 shadow-xl shadow-base-content/5 backdrop-blur-xl">
      <div class="navbar-start">
        <div class="dropdown z-[1000]">
          <button tabindex="0" class="btn btn-ghost btn-circle" aria-label="Open navigation menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 w-52 rounded-3xl border border-base-content/10 bg-base-100 p-2 shadow-2xl"
          >
            <li><a routerLink="">Homepage</a></li>
            <li><a routerLink="about">About</a></li>
            <li><a routerLink="country">Country</a></li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <a class="font-poppins text-xl font-black tracking-[-0.04em] text-contrast">ngDaisy<span class="text-primary">UI</span></a>
      </div>
      <div class="navbar-end">
        <button class="btn btn-ghost btn-circle" aria-label="Toggle theme" (click)="toggleTheme()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24px"
            height="24px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class NavbarComponent {
  toggleTheme() {
    themeStore.update((state) => ({
      ...state,
      theme: { isDark: !state.theme?.isDark },
    }))
  }
}
