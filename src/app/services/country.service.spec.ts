import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { CountryService } from './country.service'

const countriesDatasetUrl = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'

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

  it('should fetch and map countries successfully', async () => {
    const mockCountriesDataset = [
      {
        name: { common: 'Japan', official: 'Japan' },
        capital: ['A City'],
        population: 1000,
        area: 500,
        region: 'Asia',
        subregion: 'Eastern Asia',
        cca2: 'JP',
        cca3: 'JPN',
        languages: { jpn: 'Japanese' },
        currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
        independent: true,
        unMember: true,
      },
      {
        name: { common: 'France', official: 'French Republic' },
        capital: ['B City'],
        population: 2000,
        region: 'Europe',
        cca2: 'FR',
      },
    ]

    const promise = service.getCountries()

    const req = httpMock.expectOne(countriesDatasetUrl)
    expect(req.request.method).toBe('GET')
    req.flush(mockCountriesDataset)

    await expect(promise).resolves.toEqual([
      {
        name: { common: 'Japan', official: 'Japan' },
        capital: ['A City'],
        population: 1000,
        area: 500,
        continents: ['Asia'],
        region: 'Asia',
        subregion: 'Eastern Asia',
        cca3: 'JPN',
        languages: { jpn: 'Japanese' },
        currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
        independent: true,
        unMember: true,
        flags: {
          svg: 'https://flags.restcountries.com/v5/svg/jp.svg',
          alt: 'Flag of Japan',
        },
      },
      {
        name: { common: 'France', official: 'French Republic' },
        capital: ['B City'],
        population: 2000,
        area: undefined,
        continents: ['Europe'],
        region: 'Europe',
        subregion: undefined,
        cca3: undefined,
        languages: undefined,
        currencies: undefined,
        independent: undefined,
        unMember: undefined,
        flags: {
          svg: 'https://flags.restcountries.com/v5/svg/fr.svg',
          alt: 'Flag of France',
        },
      },
    ])
  })

  it('should reject when the API errors', async () => {
    const promise = service.getCountries()

    httpMock.expectOne(countriesDatasetUrl).flush('Error loading', { status: 500, statusText: 'Server Error' })

    await expect(promise).rejects.toBeDefined()
  })

  it('should reject when the dataset is not an array', async () => {
    const promise = service.getCountries()

    httpMock.expectOne(countriesDatasetUrl).flush({ success: false })

    await expect(promise).rejects.toThrow('Expected countries dataset to return an array')
  })
})
