import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { CountryService } from './country.service'

const enrichedCountryUrl =
  'https://restcountries.com/v3.1/all?fields=flags,name,capital,population,area,continents,region,subregion,cca3,languages'
const baseCountryUrl =
  'https://restcountries.com/v3.1/all?fields=flags,name,capital,population,continents,region,subregion'

function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('CountryService', () => {
  let service: CountryService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService],
    })
    service = TestBed.inject(CountryService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should fetch countries successfully', async () => {
    const mockCountries = [
      {
        name: { official: 'Country A' },
        flags: { svg: 'a.svg' },
        capital: ['A City'],
        population: 1000,
        continents: ['Europe'],
      },
      {
        name: { official: 'Country B' },
        flags: { svg: 'b.svg' },
        capital: ['B City'],
        population: 2000,
        continents: ['Asia'],
      },
    ]

    const promise = service.getCountries()

    const req = httpMock.expectOne(enrichedCountryUrl)
    expect(req.request.method).toBe('GET')
    req.flush(mockCountries)

    await expect(promise).resolves.toEqual(mockCountries)
  })

  it('should fallback to base fields when enriched fields are rejected', async () => {
    const mockCountries = [
      {
        name: { official: 'Country A' },
        flags: { svg: 'a.svg' },
        capital: ['A City'],
        population: 1000,
        continents: ['Europe'],
      },
    ]

    const promise = service.getCountries()

    httpMock.expectOne(enrichedCountryUrl).flush({ message: 'Bad request' })
    await nextTick()
    httpMock.expectOne(baseCountryUrl).flush(mockCountries)

    await expect(promise).resolves.toEqual(mockCountries)
  })

  it('should reject when the API errors', async () => {
    const promise = service.getCountries()

    httpMock.expectOne(enrichedCountryUrl).flush('Error loading', { status: 500, statusText: 'Server Error' })
    await nextTick()
    httpMock.expectOne(baseCountryUrl).flush('Error loading', { status: 500, statusText: 'Server Error' })

    await expect(promise).rejects.toBeDefined()
  })
})
