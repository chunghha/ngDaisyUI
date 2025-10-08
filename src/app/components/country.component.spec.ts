import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental'
import { render } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import { CountryService } from '../services/country.service'
import { buildCountriesQuery, COUNTRIES_QUERY_KEY } from './country.component'

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

/**
 * Minimal integration smoke test: ensure the query runs and caches data.
 * Avoids DOM-dependent waits & structural directives.
 */
describe('CountryComponent integration (smoke)', () => {
  it('executes query and stores result in QueryClient cache', async () => {
    const data = [
      { name: { official: 'Alpha' }, flags: { svg: 'a.svg' } },
      { name: { official: 'Beta' }, flags: { svg: 'b.svg' } },
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
})
