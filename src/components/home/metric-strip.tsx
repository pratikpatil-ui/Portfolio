import { metrics } from '@/content/profile'

export function MetricStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5"
        >
          <p
            className="font-display text-[40px] leading-none font-semibold tracking-tight"
            style={{
              color: m.emphasis === 'ai' ? 'var(--color-ai)' : 'var(--color-fg)',
            }}
          >
            {m.value}
          </p>
          <p className="font-mono text-[12px] tracking-tight text-[var(--color-fg-muted)] uppercase">
            {m.label}
          </p>
          <p className="text-[13px] text-[var(--color-fg-subtle)]">{m.footnote}</p>
        </div>
      ))}
    </div>
  )
}
