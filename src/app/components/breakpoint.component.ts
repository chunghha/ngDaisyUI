import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, type Signal, signal } from '@angular/core'

function createMediaQuerySignal(query: string): Signal<boolean> {
  const destroyRef = inject(DestroyRef)
  const mql = window.matchMedia(query)
  const matches = signal(mql.matches)
  const handler = (event: MediaQueryListEvent): void => matches.set(event.matches)
  mql.addEventListener('change', handler)
  destroyRef.onDestroy(() => mql.removeEventListener('change', handler))
  return matches.asReadonly()
}

@Component({
  selector: 'Breakpoint',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="btn-group flex justify-center gap-2 p-8">
      <button type="button" [class]="buttonClasses(smActive())">sm</button>
      <button type="button" [class]="buttonClasses(lgActive())">lg</button>
      <button type="button" [class]="buttonClasses(xlActive())">xl</button>
    </div>
  `,
})
export class BreakpointComponent {
  private readonly sm = createMediaQuerySignal('(min-width: 640px)')
  private readonly lg = createMediaQuerySignal('(min-width: 1024px)')
  private readonly xl = createMediaQuerySignal('(min-width: 1280px)')

  readonly smActive = computed(() => this.sm() && !this.lg() && !this.xl())
  readonly lgActive = computed(() => this.sm() && this.lg() && !this.xl())
  readonly xlActive = computed(() => this.sm() && this.lg() && this.xl())

  buttonClasses(active: boolean): string {
    return active ? 'btn btn-secondary' : 'btn'
  }
}
