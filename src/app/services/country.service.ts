import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private url = 'https://restcountries.com/v3.1/all';
  #http = inject(HttpClient);

  getCountries() {
    return lastValueFrom(this.#http.get<any[]>(this.url));
  }
}
