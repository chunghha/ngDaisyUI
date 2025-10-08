import { render, screen } from '@testing-library/angular'
import { describe, expect, it } from 'vitest'
import { AboutComponent } from '../about.component'

/**
 * AboutComponent tests
 *
 * Behavior focus:
 * - Renders the expected descriptive text
 * - Applies layout styling class
 *
 * We avoid fragile structure / snapshot assertions per project guidelines.
 */
describe('AboutComponent', () => {
  it('renders the descriptive paragraph text', async () => {
    await render(AboutComponent)

    const paragraph = screen.getByText(/angular demo that uses the Country API/i)
    expect(paragraph).toBeTruthy()
    expect(paragraph.tagName).toBe('P')
  })

  it('applies the minimum screen height layout class', async () => {
    const { container } = await render(AboutComponent)
    const root = container.querySelector('.min-h-screen')
    expect(root).toBeTruthy()
  })
})
