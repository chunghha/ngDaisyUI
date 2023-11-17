import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { injectQuery } from '@ngneat/query';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  #http = inject(HttpClient);
  #query = injectQuery();

  private url = 'https://restcountries.com/v3.1/all';

  getCountries() {
    return this.#query({
      queryKey: ['countries'] as const,
      queryFn: () => this.#http.get<any[]>(this.url)
    });
  }
}
