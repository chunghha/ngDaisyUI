import { themeStore } from './theme.store'

describe('themeStore', () => {
  beforeEach(() => {
    themeStore.reset()
  })

  it('should have initial theme set to light', () => {
    expect(themeStore.state.theme).toEqual({ isDark: false })
  })

  it('should update theme to dark', () => {
    themeStore.update((state) => ({
      ...state,
      theme: { isDark: true },
    }))

    expect(themeStore.state.theme).toEqual({ isDark: true })
  })

  it('should reset theme to initial state', () => {
    themeStore.update((state) => ({
      ...state,
      theme: { isDark: true },
    }))

    themeStore.reset()

    expect(themeStore.state.theme).toEqual({ isDark: false })
  })

  it('should allow idempotent update when setting the same value', () => {
    themeStore.update((s) => ({ ...s, theme: { isDark: false } }))
    expect(themeStore.state.theme).toEqual({ isDark: false })
  })

  it('should toggle dark -> light -> dark correctly via successive updates', () => {
    themeStore.update((s) => ({ ...s, theme: { isDark: true } }))
    expect(themeStore.state.theme).toEqual({ isDark: true })

    themeStore.update((s) => ({ ...s, theme: { isDark: false } }))
    expect(themeStore.state.theme).toEqual({ isDark: false })

    themeStore.update((s) => ({ ...s, theme: { isDark: true } }))
    expect(themeStore.state.theme).toEqual({ isDark: true })
  })

  it('reset should restore initial value after multiple changes', () => {
    themeStore.update((s) => ({ ...s, theme: { isDark: true } }))
    themeStore.update((s) => ({ ...s, theme: { isDark: false } }))
    themeStore.reset()
    expect(themeStore.state.theme).toEqual({ isDark: false })
  })
})
