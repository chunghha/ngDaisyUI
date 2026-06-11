import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental'
import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import { CountryService } from '../services/country.service'
import { buildCountriesQuery, COUNTRIES_QUERY_KEY, countryQueryErrorMessage } from './country.component'

/**
 * Pure helper tests (no Angular rendering).
 */
describe('buildCountriesQuery (pure helper)', () => {
  it('returns expected key and queryFn', () => {
    const svc: Partial<CountryService> = {
      getCountries: vi.fn().mockResolvedValue(['x']),
    }
    // @ts-expect-error partial for test
    const cfg = buildCountriesQuery(svc)
    expect(cfg.queryKey).toBe(COUNTRIES_QUERY_KEY)
    expect(typeof cfg.queryFn).toBe('function')
  })

  it('queryFn delegates to service.getCountries', async () => {
    const result = [{ name: { official: 'X' } }]
    const svc: Partial<CountryService> = {
      getCountries: vi.fn().mockResolvedValue(result),
    }
    // @ts-expect-error partial for test
    const { queryFn } = buildCountriesQuery(svc)
    const out = await queryFn()
    expect(out).toBe(result)
    expect(svc.getCountries).toHaveBeenCalledTimes(1)
  })
})

describe('countryQueryErrorMessage', () => {
  it('formats Error instances', () => {
    expect(countryQueryErrorMessage(new Error('Network failed'))).toBe('Network failed')
  })

  it('formats HTTP-like error objects', () => {
    expect(countryQueryErrorMessage({ status: 500, statusText: 'Server Error' })).toBe(
      'Country API request failed with 500 Server Error',
    )
  })

  it('falls back for unknown error shapes', () => {
    expect(countryQueryErrorMessage({})).toBe('Unable to load countries right now.')
  })
})

/**
 * Minimal integration smoke test: ensure the query runs and caches data.
 * Avoids DOM-dependent waits & structural directives.
 */
describe('CountryComponent integration (smoke)', () => {
  it('executes query and stores result in QueryClient cache', async () => {
    const data = [
      {
        name: { official: 'Alpha' },
        capital: ['A City'],
        continents: ['Europe'],
        flags: { svg: 'a.svg' },
        population: 1000,
      },
      {
        name: { official: 'Beta' },
        capital: ['B City'],
        continents: ['Asia'],
        flags: { svg: 'b.svg' },
        population: 2000,
      },
    ]
    const mockService: Partial<CountryService> = {
      getCountries: vi.fn().mockResolvedValue(data),
    }
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 0 } },
    })

    await render(
      // Use a tiny inline host that just instantiates component
      // NOTE: we can import CountryComponent directly but only need its query side effect.
      (await import('./country.component')).CountryComponent,
      {
        providers: [provideTanStackQuery(qc), { provide: CountryService, useValue: mockService }],
      },
    )

    // Microtask flush
    await Promise.resolve()

    expect((mockService.getCountries as any).mock.calls.length).toBe(1)
    const cached = qc.getQueryData(COUNTRIES_QUERY_KEY)
    expect(cached).toEqual(data)
  })

  it('records error state when service fails (single attempt)', async () => {
    const boom = new Error('fail')
    const mockService: Partial<CountryService> = {
      getCountries: vi.fn().mockRejectedValue(boom),
    }
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 0 } },
    })

    await render((await import('./country.component')).CountryComponent, {
      providers: [provideTanStackQuery(qc), { provide: CountryService, useValue: mockService }],
    })

    await Promise.resolve()

    expect((mockService.getCountries as any).mock.calls.length).toBe(1)
    const state = qc.getQueryState(COUNTRIES_QUERY_KEY as any)
    expect(state?.status).toBe('error')
    expect(state?.error).toBe(boom)
  })

  it('filters countries by search text and capital', async () => {
    const data = [
      {
        name: { official: 'Republic of Korea' },
        capital: ['Seoul'],
        continents: ['Asia'],
        flags: { svg: 'kr.svg' },
        population: 50_000_000,
      },
      {
        name: { official: 'Japan' },
        capital: ['Tokyo'],
        continents: ['Asia'],
        flags: { svg: 'jp.svg' },
        population: 125_000_000,
      },
    ]
    const mockService: Partial<CountryService> = {
      getCountries: vi.fn().mockResolvedValue(data),
    }
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } })

    await render((await import('./country.component')).CountryComponent, {
      providers: [provideTanStackQuery(qc), { provide: CountryService, useValue: mockService }],
    })

    expect(await screen.findByText('Republic of Korea')).toBeTruthy()

    fireEvent.input(screen.getByRole('searchbox', { name: /search countries/i }), { target: { value: 'seoul' } })

    await waitFor(() => {
      expect(screen.getByText('Republic of Korea')).toBeTruthy()
      expect(screen.queryByText('Japan')).toBeNull()
    })
  })

  it('filters countries by continent', async () => {
    const data = [
      {
        name: { official: 'Republic of Argentina' },
        capital: ['Buenos Aires'],
        continents: ['South America'],
        flags: { svg: 'ar.svg' },
        population: 45_000_000,
      },
      {
        name: { official: 'Republic of Guatemala' },
        capital: ['Guatemala City'],
        continents: ['North America'],
        flags: { svg: 'gt.svg' },
        population: 18_000_000,
      },
    ]
    const mockService: Partial<CountryService> = {
      getCountries: vi.fn().mockResolvedValue(data),
    }
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } })

    await render((await import('./country.component')).CountryComponent, {
      providers: [provideTanStackQuery(qc), { provide: CountryService, useValue: mockService }],
    })

    expect(await screen.findByText('Republic of Argentina')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'South America' }))

    await waitFor(() => {
      expect(screen.getByText('Republic of Argentina')).toBeTruthy()
      expect(screen.queryByText('Republic of Guatemala')).toBeNull()
    })
  })
})
