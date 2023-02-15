import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private url = 'https://restcountries.com/v3.1/all';

  constructor(private httpClient: HttpClient) {}

  getCountries() {
    return this.httpClient.get(this.url);
  }
}
