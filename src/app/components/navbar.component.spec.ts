import { provideRouter } from '@angular/router'
import { fireEvent, render, screen } from '@testing-library/angular'
import { themeStore } from '../stores/theme.store'
import { NavbarComponent } from './navbar.component'

/**
 * Centralized factory so template/resource resolution happens consistently.
 * Adding `imports: [NavbarComponent]` is defensive even though the component
 * is standalone – it guarantees templateUrl + styleUrls are resolved before tests run.
 */
async function renderNavbar() {
  return render(NavbarComponent, {
    imports: [NavbarComponent],
    providers: [provideRouter([])],
  })
}

function isDark() {
  return themeStore.state.theme?.isDark
}

function getThemeToggle() {
  return screen.getByRole('button', { name: /toggle theme/i })
}

describe('NavbarComponent (theme toggle)', () => {
  beforeEach(() => {
    themeStore.reset()
  })

  it('should render the toggle button', async () => {
    await renderNavbar()

    const button = getThemeToggle()
    expect(button).toBeTruthy()
    expect(isDark()).toBe(false)
  })

  it('should toggle theme from light -> dark on click', async () => {
    await renderNavbar()

    const button = getThemeToggle()
    expect(isDark()).toBe(false)

    await fireEvent.click(button)

    expect(isDark()).toBe(true)
  })

  it('should toggle theme dark -> light on second click', async () => {
    await renderNavbar()

    const button = getThemeToggle()
    expect(isDark()).toBe(false)

    await fireEvent.click(button)
    expect(isDark()).toBe(true)

    await fireEvent.click(button)
    expect(isDark()).toBe(false)
  })

  it('should not introduce unexpected properties in the store state', async () => {
    await renderNavbar()

    const initialKeys = Object.keys(themeStore.state)
    const button = getThemeToggle()

    await fireEvent.click(button)
    const afterKeys = Object.keys(themeStore.state)

    expect(afterKeys).toEqual(initialKeys)
  })
})
