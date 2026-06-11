import { EventType } from '@tanstack/ai'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLlamaCppBrowserChat } from './llama-cpp-browser-adapter'

describe('LlamaCppBrowserTextAdapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts messages to llama.cpp and emits TanStack AI text events', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: 'Country details.' } }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createLlamaCppBrowserChat('local-gguf', 'http://localhost:8080')
    const chunks = []

    for await (const chunk of adapter.chatStream({
      model: 'local-gguf',
      logger: {} as any,
      systemPrompts: ['Be concise'],
      messages: [{ role: 'user', content: 'Tell me about Japan' }],
    })) {
      chunks.push(chunk)
    }

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      model: 'local-gguf',
      stream: false,
      temperature: 0.35,
      top_p: 0.9,
      max_tokens: 260,
      messages: [
        { role: 'system', content: 'Be concise' },
        { role: 'user', content: 'Tell me about Japan' },
      ],
    })
    expect(chunks.map((chunk) => chunk.type)).toEqual([
      EventType.TEXT_MESSAGE_START,
      EventType.TEXT_MESSAGE_CONTENT,
      EventType.TEXT_MESSAGE_END,
    ])
    expect(chunks[1]).toMatchObject({ delta: 'Country details.' })
  })

  it('throws when llama.cpp returns a failed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const adapter = createLlamaCppBrowserChat('local-gguf', 'http://localhost:8080')
    const stream = adapter.chatStream({
      model: 'local-gguf',
      logger: {} as any,
      messages: [{ role: 'user', content: 'Tell me about Japan' }],
    })

    await expect(stream.next()).rejects.toThrow('llama.cpp request failed with 500')
  })

  it('throws when llama.cpp returns reasoning without final content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: '', reasoning_content: 'thinking' } }] }),
      }),
    )

    const adapter = createLlamaCppBrowserChat('local-gguf', 'http://localhost:8080')
    const stream = adapter.chatStream({
      model: 'local-gguf',
      logger: {} as any,
      messages: [{ role: 'user', content: 'Tell me about Japan' }],
    })

    await expect(stream.next()).rejects.toThrow('restart llama-server with -rea off')
  })

  it('throws when llama.cpp returns no usable content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ choices: [{ finish_reason: 'length', message: { content: '' } }] }),
      }),
    )

    const adapter = createLlamaCppBrowserChat('local-gguf', 'http://localhost:8080')
    const stream = adapter.chatStream({
      model: 'local-gguf',
      logger: {} as any,
      messages: [{ role: 'user', content: 'Tell me about Japan' }],
    })

    await expect(stream.next()).rejects.toThrow('llama.cpp returned an empty response (length)')
  })
})
