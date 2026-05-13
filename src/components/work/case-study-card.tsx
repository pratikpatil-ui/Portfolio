import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Tag } from '@/components/ui/tag'

export type CaseStudyTeaser = {
  slug: string
  eyebrow: string
  title: string
  summary: string
  clientFraming: string
  role: string
  techTags: string[]
  featured?: boolean
}

const MAX_VISIBLE_TAGS = 3

export function CaseStudyCard({ data }: { data: CaseStudyTeaser }) {
  const visibleTags = data.techTags.slice(0, MAX_VISIBLE_TAGS)
  const hiddenCount = Math.max(0, data.techTags.length - MAX_VISIBLE_TAGS)

  return (
    <Link
      href={`/work/${data.slug}`}
      className="group relative flex h-full min-w-0 flex-col gap-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border)] hover:bg-[var(--color-elevated)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="truncate font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
          {data.eyebrow}
        </p>
        {data.featured ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <h3
          className="font-display text-[20px] leading-[1.2] font-semibold tracking-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)] line-clamp-2 text-balance"
          style={{ minHeight: 'calc(20px * 1.2 * 2)' }}
        >
          {data.title}
        </h3>
        <p className="text-[15px] leading-[1.55] text-[var(--color-fg-muted)] line-clamp-3 text-pretty">
          {data.summary}
        </p>
      </div>

      <div className="mt-auto flex min-w-0 flex-col gap-3 pt-2">
        <dl className="flex flex-col gap-1 font-mono text-[11px]">
          <div className="flex min-w-0 items-baseline gap-2">
            <dt className="w-12 shrink-0 tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Client
            </dt>
            <dd className="min-w-0 truncate text-[var(--color-fg-muted)]">{data.clientFraming}</dd>
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <dt className="w-12 shrink-0 tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Role
            </dt>
            <dd className="min-w-0 truncate text-[var(--color-fg-muted)]">{data.role}</dd>
          </div>
        </dl>

        {visibleTags.length ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            {hiddenCount > 0 ? (
              <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">
                +{hiddenCount}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-end border-t border-[var(--color-border-muted)] pt-3">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-accent)]">
            Read case study
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
