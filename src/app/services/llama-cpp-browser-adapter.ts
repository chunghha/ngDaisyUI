import { EventType, type StreamChunk, type TextOptions } from '@tanstack/ai'
import { BaseTextAdapter, type StructuredOutputOptions, type StructuredOutputResult } from '@tanstack/ai/adapters'

interface LlamaCppChatResponse {
  choices?: Array<{
    finish_reason?: string
    message?: {
      content?: string
      reasoning_content?: string
    }
  }>
}

export class LlamaCppBrowserTextAdapter extends BaseTextAdapter<
  string,
  Record<string, never>,
  readonly ['text'],
  { text: unknown; image: unknown; audio: unknown; video: unknown; document: unknown }
> {
  readonly name = 'llama-cpp-browser'

  constructor(
    model: string,
    private readonly host: string,
  ) {
    super(undefined, model)
  }

  async *chatStream(options: TextOptions<Record<string, never>>): AsyncIterable<StreamChunk> {
    const messageId = this.generateId()
    const content = await this.requestChatCompletion(options)

    yield { type: EventType.TEXT_MESSAGE_START, messageId, role: 'assistant' }
    yield { type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta: content }
    yield { type: EventType.TEXT_MESSAGE_END, messageId }
  }

  async structuredOutput(
    _options: StructuredOutputOptions<Record<string, never>>,
  ): Promise<StructuredOutputResult<unknown>> {
    throw new Error('Structured output is not supported by the browser llama.cpp adapter')
  }

  private async requestChatCompletion(options: TextOptions<Record<string, never>>): Promise<string> {
    const response = await fetch(`${this.host}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        temperature: 0.35,
        top_p: 0.9,
        max_tokens: 260,
        messages: [
          ...(options.systemPrompts ?? []).map((prompt) => ({
            role: 'system',
            content: typeof prompt === 'string' ? prompt : prompt.content,
          })),
          ...options.messages.map((message) => ({
            role: message.role,
            content: typeof message.content === 'string' ? message.content : '',
          })),
        ],
      }),
      signal: options.abortController?.signal,
    })

    if (!response.ok) {
      throw new Error(`llama.cpp request failed with ${response.status}`)
    }

    const data = (await response.json()) as LlamaCppChatResponse
    const choice = data.choices?.[0]
    const content = choice?.message?.content?.trim()

    if (content) {
      return content
    }

    if (choice?.message?.reasoning_content) {
      throw new Error('llama.cpp returned reasoning but no final answer; restart llama-server with -rea off')
    }

    throw new Error(`llama.cpp returned an empty response${choice?.finish_reason ? ` (${choice.finish_reason})` : ''}`)
  }
}

export function createLlamaCppBrowserChat(model: string, host: string): LlamaCppBrowserTextAdapter {
  return new LlamaCppBrowserTextAdapter(model, host)
}
