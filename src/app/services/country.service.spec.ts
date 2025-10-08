import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { CountryService } from './country.service'

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
        capital: 'A City',
        population: 1000,
      },
      {
        name: { official: 'Country B' },
        flags: { svg: 'b.svg' },
        capital: 'B City',
        population: 2000,
      },
    ]

    const promise = service.getCountries()

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all?fields=flags,name,capital,population')
    expect(req.request.method).toBe('GET')
    req.flush(mockCountries)

    await expect(promise).resolves.toEqual(mockCountries)
  })

  it('should reject when the API errors', async () => {
    const promise = service.getCountries()

    const req = httpMock.expectOne('https://restcountries.com/v3.1/all?fields=flags,name,capital,population')
    req.flush('Error loading', { status: 500, statusText: 'Server Error' })

    await expect(promise).rejects.toBeDefined()
  })
})
