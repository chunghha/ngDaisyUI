import { Component, Input, inject, signal } from '@angular/core'
import type { Country } from '../services/country.service'
import { CountryInfoService } from '../services/country-info.service'

function firstValue(values?: Record<string, string>): string | undefined {
  return Object.values(values ?? {})[0]
}

interface CountryInfoBullet {
  label: string
  text: string
}

function parseCountryInfoBullets(countryInfo: string): CountryInfoBullet[] {
  return countryInfo
    .split('\n')
    .map((line) => line.trim().replace(/^[-*]\s*/, ''))
    .filter(Boolean)
    .map((line) => {
      const [label, ...textParts] = line.split(':')

      if (textParts.length === 0) {
        return { label: 'Note', text: label.trim() }
      }

      return { label: label.trim(), text: textParts.join(':').trim() }
    })
}

@Component({
  selector: 'CountryCard',
  standalone: true,
  template: `
    <article
      class="group flex h-full flex-col overflow-hidden border border-base-300 bg-base-100 shadow-base-content/10 shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20 hover:shadow-xl"
    >
      <figure class="relative aspect-[1.65] shrink-0 overflow-hidden bg-base-200">
        <div
          class="absolute inset-0 bg-gradient-to-t from-base-content/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
        ></div>
        <img
          [src]="country.flags.svg"
          [alt]="country.flags.alt ?? country.name.official"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </figure>

      <div class="flex min-h-0 flex-1 flex-col justify-between p-5">
        <div>
          <div class="flex items-start justify-between gap-3">
            <p
              class="inline-flex rounded-full border border-base-300 bg-base-200/70 px-3 py-1 font-inter text-base-content/60 text-xs"
            >
              {{ country.continents[0] }}
            </p>
            @if (country.cca3) {
              <p class="inline-flex rounded-full bg-secondary px-3 py-1 font-inter text-secondary-content text-xs">
                {{ country.cca3 }}
              </p>
            }
          </div>

          <div class="mt-4 min-h-32">
            <h2 class="line-clamp-2 min-h-12 font-poppins text-secondary text-xl leading-tight">
              {{ country.name.official }}
            </h2>
            <p class="mt-1 line-clamp-1 min-h-5 text-base-content/50 text-sm">
              {{ country.name.common && country.name.common !== country.name.official ? country.name.common : '' }}
            </p>
            <p class="mt-3 text-base-content/45 text-xs uppercase tracking-[0.25em]">Capital</p>
            <p class="mt-1 line-clamp-2 font-inter text-2xl text-base-content leading-tight">
              {{ countryCapitals()[0] }}
            </p>
          </div>

          <dl class="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-base-300 bg-base-300 text-sm">
            <div class="col-span-2 bg-base-100 p-3">
              <dt class="text-[10px] text-base-content/45 uppercase tracking-[0.25em]">Population</dt>
              <dd class="mt-1 font-inter text-3xl text-base-content tabular-nums leading-none">
                {{ country.population.toLocaleString() }}
              </dd>
              <dd class="mt-2 text-base-content/55 text-sm">{{ countryRegionLabel() }}</dd>
            </div>

            <div class="bg-base-100 p-3">
              <dt class="text-[10px] text-base-content/45 uppercase tracking-[0.25em]">Density</dt>
              <dd class="mt-1 text-base-content tabular-nums">{{ populationDensity() }}</dd>
            </div>

            <div class="bg-base-100 p-3">
              <dt class="text-[10px] text-base-content/45 uppercase tracking-[0.25em]">Language</dt>
              <dd class="mt-1 truncate text-base-content">{{ firstLanguage() ?? 'N/A' }}</dd>
            </div>

            <div class="col-span-2 bg-base-100 p-3">
              <dt class="text-[10px] text-base-content/45 uppercase tracking-[0.25em]">Area</dt>
              <dd class="mt-1 truncate text-base-content tabular-nums">{{ countryAreaLabel() }}</dd>
            </div>
          </dl>
        </div>

        <div class="mt-5 flex shrink-0 items-center justify-between gap-3">
          <a
            [href]="countryMapUrl()"
            target="_blank"
            rel="noreferrer"
            class="link-hover text-base-content/60 text-sm"
          >
            Map
          </a>
          <button
            type="button"
            class="btn btn-primary min-w-36 rounded-full shadow-md shadow-primary/25 transition group-hover:translate-x-1"
            [disabled]="isGeneratingCountryInfo()"
            [attr.aria-label]="isGeneratingCountryInfo() ? 'Generating ' + country.name.official + ' details' : 'Details about ' + country.name.official"
            (click)="showCountryInfo()"
          >
            {{ isGeneratingCountryInfo() ? 'Generating...' : 'Details' }}
          </button>
        </div>

        @if (countryInfoBullets().length > 0) {
          <div class="mt-4 space-y-2 border border-primary/20 bg-primary/10 p-3 text-sm leading-6">
            @for (bullet of countryInfoBullets(); track bullet.label + bullet.text) {
              <p class="text-base-content/75">
                <span class="font-poppins font-bold text-primary">{{ bullet.label }}</span>
                <span class="text-base-content/40">: </span>{{ bullet.text }}
              </p>
            }
          </div>
        }
      </div>
    </article>
  `,
})
export class CountryCardComponent {
  @Input({ required: true }) country!: Country

  #countryInfoService = inject(CountryInfoService)

  countryInfo = signal('')
  isGeneratingCountryInfo = signal(false)

  countryInfoBullets(): CountryInfoBullet[] {
    return parseCountryInfoBullets(this.countryInfo())
  }

  countryCapitals(): string[] {
    return Array.isArray(this.country.capital) ? this.country.capital : []
  }

  countryRegionLabel(): string {
    return this.country.subregion ?? this.country.region ?? this.country.continents.join(', ')
  }

  populationDensity(): string {
    if (!this.country.area) return 'N/A'
    return `${Math.round(this.country.population / this.country.area).toLocaleString()}/km²`
  }

  firstLanguage(): string | undefined {
    return firstValue(this.country.languages)
  }

  countryAreaLabel(): string {
    return this.country.area ? `${this.country.area.toLocaleString()} km²` : 'N/A'
  }

  countryMapUrl(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.country.name.common ?? this.country.name.official)}`
  }

  async showCountryInfo(): Promise<void> {
    if (this.isGeneratingCountryInfo()) return

    this.isGeneratingCountryInfo.set(true)

    try {
      this.countryInfo.set(await this.#countryInfoService.describeCountry(this.country))
    } catch (_error) {
      this.countryInfo.set('Could not generate AI details. Try again when the local AI service is available.')
    } finally {
      this.isGeneratingCountryInfo.set(false)
    }
  }
}
