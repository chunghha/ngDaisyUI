import { ChangeDetectionStrategy, Component } from '@angular/core'
import { counter, decreaseCounter, increaseCounter } from '../stores/counter.store'

@Component({
  selector: 'Counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center gap-3 text-center font-poppins">
      <button
        type="button"
        aria-label="-"
        class="btn btn-secondary btn-circle btn-sm shadow-md shadow-secondary/30 transition-transform hover:-translate-y-0.5"
        (click)="decrease()"
      >
        -
      </button>
      <span class="min-w-24 font-bold text-base-content">Counter: {{ count() }}</span>
      <button
        type="button"
        aria-label="+"
        class="btn btn-secondary btn-circle btn-sm shadow-md shadow-secondary/30 transition-transform hover:-translate-y-0.5"
        (click)="increase()"
      >
        +
      </button>
    </div>
  `,
})
export class CounterComponent {
  count = counter

  decrease(): void {
    decreaseCounter()
  }

  increase(): void {
    increaseCounter()
  }
}
