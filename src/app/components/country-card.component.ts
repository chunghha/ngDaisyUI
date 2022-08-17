import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'CountryCard',
  templateUrl: './country-card.component.html',
  standalone: true,
  imports: [NgIf]
})
export class CountryCardComponent {
  @Input() country: any;
}
