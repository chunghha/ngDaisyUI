import { Service } from '@angular/core'
import { chat } from '@tanstack/ai'
import type { Country } from './country.service'
import { createLlamaCppBrowserChat } from './llama-cpp-browser-adapter'

const COUNTRY_INFO_MODEL = 'local-gguf'
const LLAMA_CPP_HOST = 'http://127.0.0.1:8080'

function firstValue(values?: Record<string, string>): string | undefined {
  return Object.values(values ?? {})[0]
}

function languageList(languages?: Record<string, string>): string {
  return Object.values(languages ?? {}).join(', ') || 'N/A'
}

function currencyList(currencies?: Country['currencies']): string {
  return (
    Object.entries(currencies ?? {})
      .map(([code, currency]) => `${currency.name} (${code}${currency.symbol ? `, ${currency.symbol}` : ''})`)
      .join(', ') || 'N/A'
  )
}

function sovereigntyHint(country: Country): string {
  if (country.independent === true) return 'Independent sovereign state'
  if (country.independent === false) return 'Not an independent sovereign state; describe its status carefully'

  return 'N/A'
}

function normalizeCountryInfo(countryInfo: string): string {
  return countryInfo.trim().replace(/^\*\s+/gm, '- ')
}

function countryPrompt(country: Country): string {
  return [
    'Country card data:',
    `Official name: ${country.name.official}`,
    `Common name: ${country.name.common ?? country.name.official}`,
    `Capital: ${(country.capital ?? []).join(', ') || 'N/A'}`,
    `Region: ${country.subregion ?? country.region ?? country.continents.join(', ')}`,
    `Population: ${country.population.toLocaleString()}`,
    `Primary language: ${firstValue(country.languages) ?? 'N/A'}`,
    `Languages: ${languageList(country.languages)}`,
    `Currencies: ${currencyList(country.currencies)}`,
    `Sovereignty hint: ${sovereigntyHint(country)}`,
    '',
    'Write exactly three bullets, no heading, 55-85 words total.',
    'Each line must start with "- " followed by one of these labels: Why it matters, On the ground, Watch for.',
    'Use a crisp atlas-editor voice: concrete, surprising, and useful, not formal policy prose.',
    'Make each bullet specific enough that it could not apply to most countries; include at least two details from the card data without dumping raw stats.',
    'Prefer capital character, language mix, currency, landscape, climate, daily life, or a map/status misconception over diplomatic classification.',
    'If this is an island or territory, mention the relationship, geography, climate pattern, or local language/currency that makes it distinct.',
    'Example tone for Aruba: "Why it matters: Aruba sits outside the main hurricane belt and runs as a self-governing Dutch Kingdom country, a rare status for a tiny Caribbean island."',
    'For On the ground, describe how a visitor or map reader would notice the place: capital, languages, currency, landscape, or everyday orientation.',
    'For Watch for, add a new caveat not already used in the first two bullets: hurricane belt, trade winds, currency confusion, dependency status, map scale, or language assumptions. Do not repeat the same language point twice.',
    'Never call a country independent unless the Sovereignty hint says "Independent sovereign state".',
    'Avoid these words and phrases: independent state status, governed by heritage, unique, entity, geopolitical context, international relations, regional trade, operates as, transactions, administrative structure, non-UN member, 180 km2, despite its small area.',
    'Do not use generic phrases like "vibrant culture", "rich history", "beautiful beaches", or "popular destination" unless you name a concrete detail.',
  ].join('\n')
}

@Service()
export class CountryInfoService {
  #adapter = createLlamaCppBrowserChat(COUNTRY_INFO_MODEL, LLAMA_CPP_HOST)

  async describeCountry(country: Country): Promise<string> {
    try {
      const countryInfo = await chat({
        adapter: this.#adapter,
        stream: false,
        systemPrompts: [
          'Answer directly with final text only. You are a precise country analyst for an atlas UI. Prefer specific, verifiable details over generic travel copy. Do not show reasoning.',
        ],
        messages: [{ role: 'user', content: countryPrompt(country) }],
      })

      return (
        normalizeCountryInfo(countryInfo) ||
        'The local model returned an empty answer. Restart llama-server with -rea off and try again.'
      )
    } catch (_error) {
      return 'Could not generate AI details. Start llama.cpp with a GGUF model on http://127.0.0.1:8080 and keep the server running.'
    }
  }
}
