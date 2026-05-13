'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { X, Send, Square, RotateCcw, Sparkles } from 'lucide-react'
import { useAssistant } from '@/hooks/use-assistant'
import { OPEN_ASSISTANT_EVENT } from '@/lib/events'

const SUGGESTIONS = [
  'Show me his AI work',
  "What's his stack?",
  'Is he open to remote roles?',
]

export function AssistantSheet() {
  const [open, setOpen] = useState(false)
  const { messages, status, send, cancel, reset } = useAssistant()
  const [input, setInput] = useState('')
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const userScrolledRef = useRef(false)

  useEffect(() => {
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      // Focus composer when opened.
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const el = messagesRef.current
    if (!el || userScrolledRef.current) return
    el.scrollTop = el.scrollHeight
  }, [messages, status])

  function onScroll() {
    const el = messagesRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    userScrolledRef.current = !atBottom
  }

  function submit() {
    if (status === 'streaming') return
    const t = input.trim()
    if (!t) return
    setInput('')
    userScrolledRef.current = false
    void send(t)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function autosize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = Math.min(120, el.scrollHeight) + 'px'
  }

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}
      <aside
        role="dialog"
        aria-label="Portfolio assistant"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 flex h-[100dvh] w-full flex-col border-l border-[var(--color-border)] bg-[var(--color-bg)] transition-transform duration-300 sm:w-[480px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'var(--ease-out-quart)' }}
      >
        <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border-muted)] px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-muted)]"
              style={{
                background: 'color-mix(in oklab, var(--color-ai) 12%, transparent)',
              }}
            >
              <Sparkles
                className="h-[18px] w-[18px]"
                style={{ color: 'var(--color-ai)' }}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-caption font-medium text-[var(--color-fg)]">
                Pratik&apos;s assistant
              </p>
              <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                Powered by Gemini. Knows about Pratik&apos;s work.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={reset}
                aria-label="Reset conversation"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div
          ref={messagesRef}
          onScroll={onScroll}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col gap-4">
              <p className="text-body text-[var(--color-fg)]">
                Hi. I can answer questions about Pratik&apos;s work.
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setInput('')
                      void send(s)
                    }}
                    className="rounded-[var(--radius-sm)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] px-3 py-2 text-left text-caption text-[var(--color-fg-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-fg)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => {
            const isUser = m.role === 'user'
            const isLastAssistant =
              !isUser && i === messages.length - 1 && status === 'streaming'
            return (
              <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={
                    isUser
                      ? 'max-w-[85%] rounded-[var(--radius-md)] bg-[var(--color-elevated)] px-3 py-2 text-body text-[var(--color-fg)]'
                      : 'max-w-[92%] border-l-2 border-[var(--color-accent)] pl-3 text-body text-[var(--color-fg)]'
                  }
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="prose-assistant">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      {isLastAssistant ? (
                        <span
                          aria-hidden
                          className="ml-0.5 inline-block h-[1em] w-px -translate-y-[1px] animate-pulse bg-[var(--color-accent)] align-middle"
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="flex items-end gap-2 border-t border-[var(--color-border-muted)] bg-[var(--color-bg)] p-3"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={autosize}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask about Pratik's work..."
            className="max-h-[120px] min-h-[40px] flex-1 resize-none rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-body text-[var(--color-fg)] focus:outline-none"
            disabled={status === 'streaming'}
          />
          {status === 'streaming' ? (
            <button
              type="button"
              onClick={cancel}
              aria-label="Stop"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:brightness-110 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </form>

        <style>{`
          .prose-assistant p { margin: 0 0 0.6em 0; }
          .prose-assistant p:last-child { margin-bottom: 0; }
          .prose-assistant ul, .prose-assistant ol { padding-left: 1.25rem; margin: 0.4em 0; }
          .prose-assistant li { margin: 0.2em 0; }
          .prose-assistant code { background: var(--color-code-bg); padding: 0.1em 0.3em; border-radius: 4px; font-size: 0.9em; }
          .prose-assistant pre { background: var(--color-code-bg); padding: 0.6em 0.8em; border-radius: 6px; overflow-x: auto; font-size: 0.85em; }
          .prose-assistant a { color: var(--color-accent); }
          .prose-assistant strong { color: var(--color-fg); font-weight: 600; }
        `}</style>
      </aside>
    </>
  )
}
