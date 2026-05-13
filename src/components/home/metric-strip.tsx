import { metrics } from '@/content/profile'

export function MetricStrip() {
  return (
    <ul className="grid grid-cols-2 border-y border-[var(--color-border-muted)] sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((m, i) => (
        <li
          key={m.label}
          className={
            'flex min-w-0 flex-col gap-1.5 px-4 py-5 ' +
            'border-t border-[var(--color-border-muted)] [&:nth-child(-n+2)]:border-t-0 ' +
            'sm:[&:nth-child(-n+3)]:border-t-0 lg:[&:nth-child(-n+5)]:border-t-0 ' +
            (i > 0 ? 'border-l border-[var(--color-border-muted)] ' : '') +
            '[&:nth-child(2n+1)]:border-l-0 sm:[&:nth-child(3n+1)]:border-l-0 ' +
            'sm:[&:nth-child(2n+1)]:border-l lg:[&:nth-child(3n+1)]:border-l ' +
            'lg:[&:nth-child(5n+1)]:border-l-0'
          }
        >
          <p
            className="font-display font-semibold leading-[1.1] tracking-tight tabular-nums text-balance"
            style={{
              fontSize: 'clamp(22px, 2.2vw, 30px)',
              color: m.emphasis === 'ai' ? 'var(--color-ai)' : 'var(--color-fg)',
            }}
          >
            {m.value}
          </p>
          <p className="font-mono text-[11px] leading-snug tracking-widest text-[var(--color-fg-muted)] uppercase">
            {m.label}
          </p>
          <p className="text-[12.5px] leading-snug text-[var(--color-fg-subtle)]">{m.footnote}</p>
        </li>
      ))}
    </ul>
  )
}
