import { TestBed } from '@angular/core/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Country } from './country.service'
import { CountryInfoService } from './country-info.service'

const chatMock = vi.hoisted(() => vi.fn())
const createLlamaCppBrowserChatMock = vi.hoisted(() => vi.fn(() => 'llama-cpp-adapter'))

vi.mock('@tanstack/ai', () => ({
  chat: chatMock,
}))

vi.mock('./llama-cpp-browser-adapter', () => ({
  createLlamaCppBrowserChat: createLlamaCppBrowserChatMock,
}))

describe('CountryInfoService', () => {
  const country: Country = {
    name: { common: 'South Korea', official: 'Republic of Korea' },
    capital: ['Seoul'],
    continents: ['Asia'],
    region: 'Asia',
    subregion: 'Eastern Asia',
    cca3: 'KOR',
    languages: { kor: 'Korean' },
    currencies: { KRW: { name: 'South Korean won', symbol: '₩' } },
    independent: true,
    unMember: true,
    population: 51_744_876,
    area: 100_210,
    flags: { svg: 'kr.svg' },
  }

  beforeEach(() => {
    TestBed.resetTestingModule()
    chatMock.mockReset()
    createLlamaCppBrowserChatMock.mockClear()
  })

  it('requests concise country info from TanStack AI using llama.cpp', async () => {
    chatMock.mockResolvedValue('* Why it matters: Seoul anchors a highly urbanized tech economy.')

    const result = await TestBed.inject(CountryInfoService).describeCountry(country)

    expect(result).toBe('- Why it matters: Seoul anchors a highly urbanized tech economy.')
    expect(createLlamaCppBrowserChatMock).toHaveBeenCalledWith('local-gguf', 'http://127.0.0.1:8080')
    expect(chatMock).toHaveBeenCalledWith(
      expect.objectContaining({
        adapter: 'llama-cpp-adapter',
        stream: false,
        systemPrompts: [expect.stringContaining('precise country analyst')],
      }),
    )
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Republic of Korea')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Seoul')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Korean')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('South Korean won')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Sovereignty hint: Independent sovereign state')
    expect(chatMock.mock.calls[0][0].messages[0].content).not.toContain('UN member:')
    expect(chatMock.mock.calls[0][0].messages[0].content).not.toContain('Area:')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Write exactly three bullets')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('On the ground')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('crisp atlas-editor voice')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('geopolitical context')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('transactions')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('administrative structure')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Do not repeat the same language point twice')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Never call a country independent')
    expect(chatMock.mock.calls[0][0].messages[0].content).toContain('Do not use generic phrases')
    expect(chatMock.mock.calls[0][0].systemPrompts[0]).toContain('Do not show reasoning')
  })

  it('returns a helpful message when local llama.cpp is unavailable', async () => {
    chatMock.mockRejectedValue(new Error('connect ECONNREFUSED'))

    const result = await TestBed.inject(CountryInfoService).describeCountry(country)

    expect(result).toContain('Could not generate AI details')
    expect(result).toContain('llama.cpp')
    expect(result).toContain('http://127.0.0.1:8080')
  })

  it('returns a helpful message when the model returns empty text', async () => {
    chatMock.mockResolvedValue('')

    const result = await TestBed.inject(CountryInfoService).describeCountry(country)

    expect(result).toContain('empty answer')
    expect(result).toContain('-rea off')
  })
})
