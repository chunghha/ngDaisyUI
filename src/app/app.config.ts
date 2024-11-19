import type { ApplicationConfig } from '@angular/core'
import { provideRouter } from '@angular/router'

import { provideHttpClient } from '@angular/common/http'
import { QueryClient, provideTanStackQuery, withDevtools } from '@tanstack/angular-query-experimental'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [provideTanStackQuery(new QueryClient(), withDevtools()), provideHttpClient(), provideRouter(routes)],
}
