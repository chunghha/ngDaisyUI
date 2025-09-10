import { provideHttpClient } from '@angular/common/http'
import { type ApplicationConfig, isDevMode } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental'
import { withDevtools } from '@tanstack/angular-query-experimental/devtools'
import { routes } from './app.routes'

// Centralized QueryClient instance so it can be referenced if needed (eg. manual invalidations)
const queryClient = new QueryClient({
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideTanStackQuery(
      queryClient,
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

// If you ever need to expose the client for imperative use elsewhere, you can
// export it here (uncomment if needed):
// export { queryClient }
