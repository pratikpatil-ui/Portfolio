import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function TeaserCard({
  href,
  eyebrow,
  title,
  description,
  meta,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  meta?: string
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full min-w-0 flex-col gap-3 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border)] hover:bg-[var(--color-elevated)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100"
      />

      <p className="truncate font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
        {eyebrow}
      </p>

      <div className="flex min-w-0 flex-col gap-2">
        <h3
          className="font-display text-[18px] leading-[1.25] font-semibold tracking-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)] line-clamp-2 text-balance"
          style={{ minHeight: 'calc(18px * 1.25 * 2)' }}
        >
          {title}
        </h3>
        <p className="text-[14.5px] leading-[1.55] text-[var(--color-fg-muted)] line-clamp-3 text-pretty">
          {description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border-muted)] pt-3">
        {meta ? (
          <p className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{meta}</p>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-accent)]">
          Open
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
