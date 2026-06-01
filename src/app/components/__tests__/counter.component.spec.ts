import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { resetCounter } from '../../stores/counter.store'
import { CounterComponent } from '../counter.component'

describe('CounterComponent', () => {
  beforeEach(() => {
    resetCounter()
  })

  it('renders the initial count', async () => {
    await render(CounterComponent)
    expect(screen.getByText(/Counter:\s*0/)).toBeTruthy()
  })

  it('increases the counter when + is clicked', async () => {
    const user = userEvent.setup()
    await render(CounterComponent)

    await user.click(screen.getByRole('button', { name: '+' }))

    expect(screen.getByText(/Counter:\s*1/)).toBeTruthy()
  })

  it('decreases the counter when - is clicked', async () => {
    const user = userEvent.setup()
    await render(CounterComponent)

    await user.click(screen.getByRole('button', { name: '-' }))

    expect(screen.getByText(/Counter:\s*-1/)).toBeTruthy()
  })

  it('increases then decreases back to zero', async () => {
    const user = userEvent.setup()
    await render(CounterComponent)

    const incrementBtn = screen.getByRole('button', { name: '+' })
    const decrementBtn = screen.getByRole('button', { name: '-' })

    await user.click(incrementBtn)
    await user.click(incrementBtn)
    expect(screen.getByText(/Counter:\s*2/)).toBeTruthy()

    await user.click(decrementBtn)
    await user.click(decrementBtn)
    expect(screen.getByText(/Counter:\s*0/)).toBeTruthy()
  })
})
