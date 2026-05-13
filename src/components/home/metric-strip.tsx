import { metrics } from '@/content/profile'

export function MetricStrip() {
  return (
    <ul className="grid grid-cols-1 divide-y divide-[var(--color-border-muted)] border-y border-[var(--color-border-muted)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
      {metrics.map((m, i) => (
        <li
          key={m.label}
          className={
            'flex flex-col gap-2 px-5 py-6 ' +
            (i % 2 === 1 ? 'sm:border-l sm:border-[var(--color-border-muted)] ' : '')
          }
        >
          <p
            className="font-display text-[clamp(28px,3vw,40px)] leading-none font-semibold tracking-tight tabular-nums"
            style={{
              color: m.emphasis === 'ai' ? 'var(--color-ai)' : 'var(--color-fg)',
            }}
          >
            {m.value}
          </p>
          <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-muted)] uppercase">
            {m.label}
          </p>
          <p className="text-[13px] leading-snug text-[var(--color-fg-subtle)]">{m.footnote}</p>
        </li>
      ))}
    </ul>
  )
}
