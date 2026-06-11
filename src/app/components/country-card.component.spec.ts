import { fireEvent, render, screen, waitFor } from '@testing-library/angular'
import { describe, expect, it, vi } from 'vitest'
import type { Country } from '../services/country.service'
import { CountryInfoService } from '../services/country-info.service'
import { CountryCardComponent } from './country-card.component'

describe('CountryCardComponent', () => {
  const country: Country = {
    name: { common: 'Japan', official: 'Japan' },
    capital: ['Tokyo'],
    continents: ['Asia'],
    region: 'Asia',
    subregion: 'Eastern Asia',
    cca3: 'JPN',
    languages: { jpn: 'Japanese' },
    population: 125_000_000,
    area: 377_975,
    flags: { svg: 'jp.svg', alt: 'Flag of Japan' },
  }

  it('requests and displays AI country info from the Details button', async () => {
    const describeCountry = vi
      .fn()
      .mockResolvedValue(
        '- Why it matters: Tokyo anchors a dense capital region.\n- On the ground: Rail stations shape daily movement.',
      )

    await render(CountryCardComponent, {
      componentInputs: { country },
      providers: [{ provide: CountryInfoService, useValue: { describeCountry } }],
    })

    fireEvent.click(screen.getByRole('button', { name: /details about japan/i }))

    expect(screen.getByRole<HTMLButtonElement>('button', { name: /generating japan details/i }).disabled).toBe(true)
    await waitFor(() => expect(screen.getByText('Why it matters')).toBeTruthy())
    expect(screen.getByText('Tokyo anchors a dense capital region.')).toBeTruthy()
    expect(screen.getByText('On the ground')).toBeTruthy()
    expect(screen.getByText('Rail stations shape daily movement.')).toBeTruthy()
    expect(describeCountry).toHaveBeenCalledWith(country)
  })

  it('shows fallback text when AI country info fails', async () => {
    const describeCountry = vi.fn().mockRejectedValue(new Error('boom'))

    await render(CountryCardComponent, {
      componentInputs: { country },
      providers: [{ provide: CountryInfoService, useValue: { describeCountry } }],
    })

    fireEvent.click(screen.getByRole('button', { name: /details about japan/i }))

    await waitFor(() => expect(screen.getByText(/Could not generate AI details/i)).toBeTruthy())
  })
})
