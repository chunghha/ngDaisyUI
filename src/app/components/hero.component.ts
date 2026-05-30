import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'Hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero relative min-h-[calc(100vh-7rem)] overflow-hidden rounded-[2rem] bg-base-100 text-contrast shadow-2xl">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(234,157,52,0.25),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(86,148,159,0.28),transparent_30%),linear-gradient(135deg,rgba(215,130,126,0.16),transparent_42%)]"></div>
      <div class="absolute top-8 right-10 hidden h-32 w-32 rounded-full border border-primary/30 md:block"></div>
      <div class="absolute bottom-10 left-8 hidden h-20 w-20 rounded-3xl bg-secondary/20 blur-sm md:block"></div>

      <div class="hero-content relative z-10 grid w-full max-w-7xl gap-12 px-6 py-14 text-left lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div class="max-w-3xl">
          <p class="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-base-100/70 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-secondary shadow-sm backdrop-blur">
            Live country explorer
          </p>
          <h1 class="mb-6 max-w-4xl font-poppins text-5xl leading-[0.95] font-black tracking-[-0.06em] text-contrast sm:text-6xl lg:text-7xl">
            Hello there, explore the world without flattening the map.
          </h1>
          <p class="mb-8 max-w-2xl text-lg leading-8 text-contrast/75 sm:text-xl">
            A tactile Angular and DaisyUI demo for browsing country data with crisp cards, quick navigation, and theme-aware contrast.
          </p>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a routerLink="country" class="btn btn-primary rounded-full px-8 font-poppins shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5">
              Get Started
            </a>
            <a routerLink="about" class="btn btn-outline rounded-full border-secondary/40 px-8 font-poppins text-contrast hover:border-secondary">
              View the brief
            </a>
          </div>
          <dl class="mt-10 grid max-w-xl grid-cols-3 gap-3 text-center sm:text-left">
            <div class="rounded-2xl border border-base-content/10 bg-base-100/65 p-4 shadow-sm backdrop-blur">
              <dt class="font-mono text-2xl font-bold text-primary">250+</dt>
              <dd class="mt-1 text-xs uppercase tracking-[0.2em] text-contrast/55">Regions</dd>
            </div>
            <div class="rounded-2xl border border-base-content/10 bg-base-100/65 p-4 shadow-sm backdrop-blur">
              <dt class="font-mono text-2xl font-bold text-secondary">2</dt>
              <dd class="mt-1 text-xs uppercase tracking-[0.2em] text-contrast/55">Themes</dd>
            </div>
            <div class="rounded-2xl border border-base-content/10 bg-base-100/65 p-4 shadow-sm backdrop-blur">
              <dt class="font-mono text-2xl font-bold text-accent">API</dt>
              <dd class="mt-1 text-xs uppercase tracking-[0.2em] text-contrast/55">Powered</dd>
            </div>
          </dl>
        </div>

        <div class="relative mx-auto w-full max-w-lg lg:mt-8">
          <div class="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-primary/30 blur-3xl"></div>
          <div class="absolute -bottom-8 -left-10 h-48 w-48 rounded-full bg-secondary/25 blur-3xl"></div>
          <div class="relative rounded-[2rem] border border-base-content/10 bg-base-100/75 p-4 shadow-2xl backdrop-blur-xl">
            <div class="rounded-[1.5rem] bg-neutral p-5 text-contrast shadow-inner">
              <div class="mb-6 flex items-center justify-between">
                <span class="rounded-full bg-base-100/80 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-secondary">Preview</span>
                <span class="h-3 w-3 rounded-full bg-success shadow-[0_0_24px_rgba(196,167,231,0.9)]"></span>
              </div>
              <div class="grid gap-4">
                <article class="group rounded-3xl bg-base-100 p-5 shadow-xl transition-transform hover:-translate-y-1">
                  <div class="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p class="font-mono text-xs uppercase tracking-[0.28em] text-accent">Capital focus</p>
                      <h2 class="mt-2 font-poppins text-3xl font-bold tracking-[-0.04em]">Seoul</h2>
                    </div>
                    <div class="grid h-14 w-20 place-items-center rounded-2xl bg-[linear-gradient(135deg,#faf4ed_0_48%,#d7827e_48%_55%,#286983_55%)] shadow-lg"></div>
                  </div>
                  <p class="leading-7 text-contrast/70">Filter by name, compare details, and keep the interface calm in either color mode.</p>
                </article>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-3xl bg-base-100/80 p-4 shadow-lg">
                    <p class="font-mono text-xs uppercase tracking-[0.2em] text-secondary">Population</p>
                    <p class="mt-3 font-poppins text-2xl font-bold">51.7M</p>
                  </div>
                  <div class="rounded-3xl bg-base-100/80 p-4 shadow-lg">
                    <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary">Currency</p>
                    <p class="mt-3 font-poppins text-2xl font-bold">KRW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  imports: [RouterLink],
})
export class HeroComponent {}
