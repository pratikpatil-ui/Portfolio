'use client'

import { useCallback, useRef, useState } from 'react'

export type AssistantMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type AssistantStatus = 'idle' | 'streaming' | 'done' | 'error'

function id() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

export function useAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [status, setStatus] = useState<AssistantStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStatus((s) => (s === 'streaming' ? 'done' : s))
  }, [])

  const reset = useCallback(() => {
    cancel()
    setMessages([])
    setError(null)
    setStatus('idle')
  }, [cancel])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      setError(null)

      const userMsg: AssistantMessage = { id: id(), role: 'user', content: trimmed }
      const assistantMsg: AssistantMessage = { id: id(), role: 'assistant', content: '' }
      const history: AssistantMessage[] = []
      setMessages((prev) => {
        const next = [...prev, userMsg, assistantMsg]
        history.push(...prev, userMsg)
        return next
      })
      setStatus('streaming')

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        })

        if (res.status === 429) {
          throw new Error('You hit the daily message limit. Email me at pratikpatilui@gmail.com.')
        }
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || `Request failed (${res.status})`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let modelError: string | null = null

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''
          for (const evt of events) {
            const line = evt.trim()
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data) as { text?: string; error?: string; message?: string }
              if (parsed.error) {
                modelError = parsed.message || parsed.error
                continue
              }
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: m.content + parsed.text } : m,
                  ),
                )
              }
            } catch {
              // ignore parse errors on partial buffers
            }
          }
        }

        if (modelError) {
          throw new Error(modelError)
        }
        setStatus('done')
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStatus('done')
          return
        }
        const msg = err instanceof Error ? err.message : 'Something went wrong'
        setError(msg)
        setStatus('error')
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id && m.content === ''
              ? { ...m, content: `(${msg})` }
              : m,
          ),
        )
      } finally {
        abortRef.current = null
      }
    },
    [],
  )

  return { messages, status, error, send, cancel, reset }
}
