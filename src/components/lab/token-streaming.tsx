'use client'

import { useEffect, useRef, useState } from 'react'

const SAMPLE =
  'Designing chat UIs for LLMs means designing the wait. Tokens stream in one at a time and the eye treats every gap longer than 80ms as a stall. At 25 words per second the surface feels engaged. Below 10 it feels broken. Above 60 it outruns the reader. The right answer is rarely the fastest answer.'

export function TokenStreaming() {
  const [text, setText] = useState(SAMPLE)
  const [wps, setWps] = useState(25)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idxRef = useRef(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function start() {
    if (timerRef.current) clearTimeout(timerRef.current)
    const tokens = text.split(/(\s+)/).filter(Boolean)
    setOutput('')
    setRunning(true)
    idxRef.current = 0
    const interval = Math.max(16, 1000 / Math.max(1, wps))

    const tick = () => {
      const tok = tokens[idxRef.current]
      if (tok === undefined) {
        setRunning(false)
        return
      }
      setOutput((prev) => prev + tok)
      idxRef.current++
      timerRef.current = setTimeout(tick, interval)
    }
    tick()
  }

  function stop() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setRunning(false)
  }

  function reset() {
    stop()
    setOutput('')
    idxRef.current = 0
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-widest text-[var(--color-fg-muted)] uppercase">
          Source text
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-elevated)] p-3 text-body text-[var(--color-fg)]"
        />
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] tracking-widest text-[var(--color-fg-muted)] uppercase">
            Words per second
          </span>
          <span className="font-mono text-[12px] text-[var(--color-accent)]">{wps} wps</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={wps}
          onChange={(e) => setWps(parseInt(e.target.value, 10))}
          className="w-full accent-[var(--color-accent)]"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={running ? stop : start}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-1.5 text-caption font-medium text-[var(--color-accent-fg)] hover:brightness-110"
        >
          {running ? 'Stop' : 'Stream'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-1.5 text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          Reset
        </button>
      </div>

      <div
        className="min-h-[140px] rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-4 text-body leading-relaxed text-[var(--color-fg)]"
        aria-live="polite"
      >
        {output}
        {running ? (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1.1em] w-px -translate-y-[1px] animate-pulse bg-[var(--color-accent)] align-middle"
          />
        ) : null}
      </div>

      <p className="text-body text-[var(--color-fg-muted)]">
        Designing chat UIs for LLMs means designing the wait. 25 wps feels engaged. Below 10 wps
        feels broken. Above 60 wps is faster than analysts can actually read.
      </p>
    </div>
  )
}
