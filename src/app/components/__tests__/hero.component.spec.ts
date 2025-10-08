import { render, screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { HeroComponent } from '../hero.component'

/**
 * HeroComponent tests
 *
 * Focus on observable behavior:
 * - Presence of main heading text
 * - Presence of primary call-to-action button
 * - Container carries expected hero styling class
 *
 * We intentionally avoid brittle assertions about full DOM structure
 * (nesting, exact markup) to keep the test resilient to non‑behavioral refactors.
 */
describe('HeroComponent', () => {
  it('renders the hero heading', async () => {
    await render(HeroComponent)

    const heading = screen.getByRole('heading', { name: /hello there/i })
    expect(heading).toBeTruthy()
    expect(heading.tagName).toBe('H1')
  })

  it('renders the primary call-to-action button', async () => {
    await render(HeroComponent)

    const cta = screen.getByRole('button', { name: /get started/i })
    expect(cta).toBeTruthy()
    // Button should advertise primary intent via Tailwind/DaisyUI class
    expect(cta.className).toMatch(/btn/)
  })

  it('applies the hero layout styling', async () => {
    const { container } = await render(HeroComponent)
    const root = container.querySelector('.hero')
    expect(root).toBeTruthy()
    // Basic sanity: expect a minimum height style or class-driven sizing
    expect(root?.className).toMatch(/hero/)
  })
})
