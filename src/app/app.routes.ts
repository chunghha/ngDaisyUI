import { Routes } from '@angular/router'
import { AboutComponent } from './components/about.component'
import { HeroComponent } from './components/hero.component'

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'country',
    loadComponent: () => import('./components/country.component').then((c) => c.CountryComponent),
  },
]
