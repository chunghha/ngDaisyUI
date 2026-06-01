import { render, screen } from '@testing-library/angular'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BreakpointComponent } from '../breakpoint.component'

const mediaMatches: Record<string, boolean> = {
  '(min-width: 640px)': true,
  '(min-width: 1024px)': false,
  '(min-width: 1280px)': false,
}

vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: mediaMatches[query] ?? false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
)

function activeButtons(): HTMLElement[] {
  return screen.getAllByRole('button').filter((b) => b.classList.contains('btn-secondary'))
}

describe('BreakpointComponent', () => {
  beforeEach(() => {
    mediaMatches['(min-width: 640px)'] = true
    mediaMatches['(min-width: 1024px)'] = false
    mediaMatches['(min-width: 1280px)'] = false
  })

  it('renders three breakpoint buttons', async () => {
    await render(BreakpointComponent)

    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'sm' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'lg' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'xl' })).toBeTruthy()
  })

  it('highlights only sm at the small breakpoint', async () => {
    mediaMatches['(min-width: 640px)'] = true
    mediaMatches['(min-width: 1024px)'] = false
    mediaMatches['(min-width: 1280px)'] = false

    await render(BreakpointComponent)

    const active = activeButtons()
    expect(active).toHaveLength(1)
    expect(active[0].textContent?.trim()).toBe('sm')
  })

  it('highlights only lg at the large breakpoint', async () => {
    mediaMatches['(min-width: 640px)'] = true
    mediaMatches['(min-width: 1024px)'] = true
    mediaMatches['(min-width: 1280px)'] = false

    await render(BreakpointComponent)

    const active = activeButtons()
    expect(active).toHaveLength(1)
    expect(active[0].textContent?.trim()).toBe('lg')
  })

  it('highlights only xl at the xl breakpoint', async () => {
    mediaMatches['(min-width: 640px)'] = true
    mediaMatches['(min-width: 1024px)'] = true
    mediaMatches['(min-width: 1280px)'] = true

    await render(BreakpointComponent)

    const active = activeButtons()
    expect(active).toHaveLength(1)
    expect(active[0].textContent?.trim()).toBe('xl')
  })
})
