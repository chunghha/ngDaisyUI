import { Component, computed, inject, signal } from '@angular/core'
import { injectQuery } from '@tanstack/angular-query-experimental'
import { broaden } from '../query-keys'
import { type Country, CountryService } from '../services/country.service'
import { CountryCardComponent } from './country-card.component'

/**
 * Exported for reuse in tests and potential other modules so we avoid
 * duplicating the literal countries query key.
 */
export const COUNTRIES_QUERY_KEY = broaden(['countries'] as const, 1)

/**
 * Pure helper that builds the TanStack Query config for countries.
 * This is unit-testable without rendering an Angular component.
 */
export function buildCountriesQuery(countryService: CountryService) {
  return {
    queryKey: COUNTRIES_QUERY_KEY,
    queryFn: () => countryService.getCountries(),
  }
}

@Component({
  selector: 'Country',
  standalone: true,
  template: `
    <div class="relative overflow-hidden bg-gradient-to-br from-base-100 via-neutral/70 to-base-100 px-3 sm:px-5">
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(30deg,currentColor_1px,transparent_1px),linear-gradient(150deg,currentColor_1px,transparent_1px)] [background-size:42px_42px] text-secondary"
      ></div>
      <div class="pointer-events-none absolute top-16 right-8 h-56 w-56 rounded-full bg-accent/20 blur-3xl"></div>
      <div class="pointer-events-none absolute bottom-32 left-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl"></div>
      <div class="mx-auto max-w-8xl pb-8 pt-6 sm:pt-8">
        @if (query.isPending()) {
          <section class="animate-pulse" data-test-name="spinning-circles">
            <div class="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(340px,0.45fr)] lg:items-end">
              <div class="border-base-300 border-l-4 pl-6">
                <div class="h-4 w-36 bg-base-300"></div>
                <div class="mt-4 h-14 max-w-3xl bg-base-300 sm:h-20"></div>
                <div class="mt-3 h-14 max-w-2xl bg-base-300/70"></div>
                <div class="mt-5 h-5 max-w-xl bg-base-300/60"></div>
              </div>

              <div class="border border-base-300 bg-base-100/70 p-5 shadow-base-content/10 shadow-md">
                <div class="flex items-end justify-between gap-4 border-base-300 border-b pb-4">
                  <div>
                    <div class="h-3 w-20 bg-base-300"></div>
                    <div class="mt-2 h-10 w-24 bg-base-300"></div>
                  </div>
                  <div class="h-10 w-20 bg-base-300/70"></div>
                </div>
                <div class="mt-5 h-14 border border-base-300 bg-base-200/60"></div>
              </div>
            </div>

            <div class="mt-6 flex gap-2 overflow-hidden border-base-300 border-y py-3">
              @for (_ of skeletonFilters; track $index) {
                <div class="h-8 w-28 shrink-0 rounded-full bg-base-300"></div>
              }
            </div>

            <div class="mt-6 grid auto-rows-fr grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
              @for (_ of skeletonCards; track $index) {
                <article class="overflow-hidden border border-base-300 bg-base-100/75 shadow-base-content/10 shadow-md">
                  <div class="aspect-[16/9] bg-base-300"></div>
                  <div class="min-h-64 p-5">
                    <div class="flex gap-2">
                      <div class="h-6 w-24 rounded-full bg-base-300"></div>
                      <div class="h-6 w-14 rounded-full bg-base-300"></div>
                    </div>
                    <div class="mt-4 h-7 w-4/5 bg-base-300"></div>
                    <div class="mt-3 h-8 w-2/3 bg-base-300/70"></div>
                    <div class="mt-6 border-base-300 border-t pt-4">
                      <div class="h-9 w-40 bg-base-300"></div>
                      <div class="mt-2 h-4 w-32 bg-base-300/70"></div>
                    </div>
                  </div>
                </article>
              }
            </div>
          </section>
        } @else if (query.isError()) {
          <div class="text-error">{{ query.status() }}: {{ query.error() }}</div>
        } @else {
          <section class="relative overflow-hidden">
            <div
              class="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-5xl rounded-full bg-primary/10 blur-3xl"
            ></div>

            <div class="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.42fr)] lg:items-end">
              <div class="relative border-primary border-l-4 bg-base-100/35 p-6 shadow-base-content/5 shadow-sm backdrop-blur-sm">
                <div class="absolute top-4 right-4 h-3 w-3 bg-accent"></div>
                <p class="font-semibold font-inter text-primary text-xs uppercase tracking-[0.55em]">Atlas board</p>
                <h1 class="mt-3 max-w-4xl font-poppins text-4xl text-base-content leading-[0.92] sm:text-6xl lg:text-7xl">
                  Countries, filtered at a glance.
                </h1>
                <p class="mt-5 max-w-2xl text-base-content/70 text-lg leading-relaxed">
                  Search by country or capital, then narrow the board by continent without losing the flag-first scan.
                </p>
                <div class="mt-6 flex flex-wrap gap-2 text-base-content/55 text-xs uppercase tracking-[0.22em]">
                  <span class="border border-base-300 bg-base-100/55 px-3 py-2">Flag first</span>
                  <span class="border border-base-300 bg-base-100/55 px-3 py-2">Capital search</span>
                  <span class="border border-base-300 bg-base-100/55 px-3 py-2">Continent rail</span>
                </div>
              </div>

              <div class="border border-base-300 bg-base-100/90 p-5 shadow-base-content/10 shadow-xl backdrop-blur-md">
                <div class="flex items-end justify-between gap-4 border-base-300 border-b pb-4">
                  <div>
                    <p class="text-base-content/50 text-xs uppercase tracking-[0.3em]">Showing</p>
                    <p class="mt-1 font-poppins text-3xl text-secondary tabular-nums">
                      {{ filteredCountries().length }}/{{ countries().length }}
                    </p>
                  </div>
                  <p class="max-w-32 text-right text-base-content/60 text-sm">live results</p>
                </div>

                <label
                  class="mt-5 flex h-14 items-center gap-3 border border-base-300 bg-base-200/60 px-4 text-base-content transition focus-within:border-primary focus-within:bg-base-100"
                >
                  <span class="text-lg text-primary">⌕</span>
                  <input
                    type="search"
                    aria-label="Search countries"
                    class="w-full bg-transparent outline-none placeholder:text-base-content/40"
                    placeholder="Country or capital"
                    [value]="searchText()"
                    (input)="setSearchText($event)"
                  />
                </label>
              </div>
            </div>

            <div class="sticky top-0 z-10 mt-6 flex gap-2 overflow-x-auto border-base-300 border-y bg-base-100/70 py-3 backdrop-blur-md [scrollbar-width:none]">
              @for (continent of continents(); track continent) {
                <button
                  type="button"
                  [class]="continentButtonClasses(continent)"
                  (click)="selectedContinent.set(continent)"
                >
                  {{ continent }}
                </button>
              }
            </div>

            <div class="mt-6 grid auto-rows-fr grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
              @for (country of filteredCountries(); track country.cca3 ?? country.name.official) {
                <CountryCard [country]="country" />
              }
            </div>

            @if (filteredCountries().length === 0) {
              <div class="mx-auto max-w-xl border border-base-300 bg-base-100 p-8 text-center shadow-md">
                <p class="font-poppins text-2xl text-secondary">No countries found</p>
                <p class="mt-2 text-base-content/70">
                  No match for “{{ searchText() || 'any search' }}” in {{ selectedContinent() }}. Try All continents or
                  a different term.
                </p>
              </div>
            }
          </section>
        }
      </div>
    </div>
  `,
  imports: [CountryCardComponent],
})
export class CountryComponent {
  _countryService = inject(CountryService)

  query = injectQuery(() => buildCountriesQuery(this._countryService))

  searchText = signal('')
  selectedContinent = signal('All')
  skeletonFilters = Array.from({ length: 6 })
  skeletonCards = Array.from({ length: 8 })

  countries = computed(() => this.query.data() ?? [])

  continents = computed(() => {
    const values = this.countries().flatMap((country) => country.continents ?? [])
    return ['All', ...Array.from(new Set(values)).sort()]
  })

  filteredCountries = computed(() => {
    const normalizedSearch = this.searchText().trim().toLowerCase()
    const continent = this.selectedContinent()

    return this.countries().filter((country) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        country.name.official.toLowerCase().includes(normalizedSearch) ||
        this.countryCapitals(country).some((capital) => capital.toLowerCase().includes(normalizedSearch))
      const matchesContinent = continent === 'All' || country.continents?.includes(continent)

      return matchesSearch && matchesContinent
    })
  })

  setSearchText(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value)
  }

  continentButtonClasses(continent: string): string {
    const baseClasses = 'btn btn-sm shrink-0 rounded-full border-base-300 px-4 font-inter normal-case'

    if (this.selectedContinent() === continent) {
      return `${baseClasses} btn-primary shadow-md shadow-primary/20`
    }

    return `${baseClasses} btn-ghost bg-base-100/55`
  }

  private countryCapitals(country: Country): string[] {
    return Array.isArray(country.capital) ? country.capital : []
  }
}
