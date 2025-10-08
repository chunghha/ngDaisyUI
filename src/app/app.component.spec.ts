import { provideRouter } from '@angular/router'
import { render } from '@testing-library/angular'
import { AppComponent } from './app.component'
import { THEMES, themeStore } from './stores/theme.store'

describe('AppComponent (theme side effects)', () => {
  beforeEach(() => {
    // Ensure a clean store before each test
    themeStore.reset()
    document.body.removeAttribute('data-theme')
  })

  afterEach(() => {
    // Clean up any lingering attribute (defensive)
    document.body.removeAttribute('data-theme')
  })

  async function renderApp() {
    return render(AppComponent, {
      imports: [AppComponent],
      providers: [provideRouter([])],
    })
  }

  it('should apply initial light theme to body via data-theme attribute', async () => {
    await renderApp()
    expect(themeStore.state.theme?.isDark).toBe(false)
    expect(document.body.getAttribute('data-theme')).toBe(THEMES.LIGHT)
  })

  it('should switch to dark theme when store updates isDark=true', async () => {
    await renderApp()

    // Simulate theme toggle
    themeStore.update((s) => ({ ...s, theme: { isDark: true } }))

    expect(themeStore.state.theme?.isDark).toBe(true)
    expect(document.body.getAttribute('data-theme')).toBe(THEMES.DARK)
  })

  it('should respond to multiple successive theme changes', async () => {
    await renderApp()

    // light -> dark
    themeStore.update((s) => ({ ...s, theme: { isDark: true } }))
    expect(document.body.getAttribute('data-theme')).toBe(THEMES.DARK)

    // dark -> light
    themeStore.update((s) => ({ ...s, theme: { isDark: false } }))
    expect(document.body.getAttribute('data-theme')).toBe(THEMES.LIGHT)

    // light -> dark again
    themeStore.update((s) => ({ ...s, theme: { isDark: true } }))
    expect(document.body.getAttribute('data-theme')).toBe(THEMES.DARK)
  })
})
