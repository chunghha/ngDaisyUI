import { provideHttpClient } from '@angular/common/http'
import { type ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query'
import { withDevtools } from '@tanstack/angular-query-devtools'
import { routes } from './app.routes'

// Centralized QueryClient factory so tests and imperative callers can create
// isolated clients with the same defaults.
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Adjust defaults as needed for your app
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        retry: 2,
      },
      mutations: {
        retry: 1,
      },
    },
  })
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideTanStackQuery(
      createQueryClient,
      ...(isDevMode()
        ? [
            withDevtools(() => ({
              initialIsOpen: false,
            })),
          ]
        : []),
    ),
    provideHttpClient(),
    provideRouter(routes),
  ],
}
