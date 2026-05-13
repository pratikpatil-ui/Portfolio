'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Token = { name: string; key: string; l: number; c: number; h: number }

const DEFAULTS: Token[] = [
  { name: 'Background', key: '--color-bg', l: 0.16, c: 0.005, h: 60 },
  { name: 'Foreground', key: '--color-fg', l: 0.96, c: 0.005, h: 80 },
  { name: 'Accent', key: '--color-accent', l: 0.78, c: 0.14, h: 200 },
  { name: 'AI accent', key: '--color-ai', l: 0.82, c: 0.13, h: 75 },
]

function fmt(t: Token) {
  return `oklch(${t.l.toFixed(2)} ${t.c.toFixed(3)} ${t.h.toFixed(0)})`
}

export function ThemeTokens() {
  const [tokens, setTokens] = useState<Token[]>(DEFAULTS)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    for (const t of tokens) el.style.setProperty(t.key, fmt(t))
  }, [tokens])

  function update(i: number, patch: Partial<Token>) {
    setTokens((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))
  }
  function reset() {
    setTokens(DEFAULTS)
  }
  function copy() {
    const css = `:root {\n${tokens.map((t) => `  ${t.key}: ${fmt(t)};`).join('\n')}\n}`
    navigator.clipboard.writeText(css).then(() => toast.success('Copied CSS to clipboard'))
  }

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {tokens.map((t, i) => (
          <div
            key={t.key}
            className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[12px] text-[var(--color-fg-muted)]">{t.name}</p>
              <div
                className="h-6 w-6 rounded-full border border-[var(--color-border)]"
                style={{ background: fmt(t) }}
              />
            </div>
            <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
              {t.key}: {fmt(t)}
            </p>
            <Slider
              label="L"
              value={t.l}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => update(i, { l: v })}
            />
            <Slider
              label="C"
              value={t.c}
              min={0}
              max={0.35}
              step={0.005}
              onChange={(v) => update(i, { c: v })}
            />
            <Slider
              label="H"
              value={t.h}
              min={0}
              max={360}
              step={1}
              onChange={(v) => update(i, { h: v })}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-1.5 text-caption font-medium text-[var(--color-accent-fg)] hover:brightness-110"
        >
          Copy as CSS
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-1.5 text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          Reset
        </button>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5">
        <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
          Preview
        </p>
        <h3 className="text-h3 pt-2 text-[var(--color-fg)]">A sample card</h3>
        <p className="text-body text-[var(--color-fg-muted)]">
          Body text against the current background. Watch the contrast as you move the lightness
          and chroma sliders.
        </p>
        <button
          type="button"
          className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-1.5 text-caption font-medium text-[var(--color-accent-fg)]"
        >
          Primary action
        </button>
      </div>

      <p className="text-body text-[var(--color-fg-muted)]">
        OKLCH is the only color space worth using for design systems. Hue stays perceptually
        constant when you change lightness, which means a primary button at 0.55 L looks the same
        hue as the same token at 0.78 L. RGB ramps shift hue across lightness.
      </p>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-4 font-mono text-[11px] text-[var(--color-fg-subtle)]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-[var(--color-accent)]"
      />
      <span className="w-12 text-right font-mono text-[11px] text-[var(--color-fg-muted)]">
        {value.toFixed(label === 'H' ? 0 : 2)}
      </span>
    </label>
  )
}
