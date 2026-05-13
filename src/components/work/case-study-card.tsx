import Link from 'next/link'
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

export function CaseStudyCard({ data }: { data: CaseStudyTeaser }) {
  return (
    <Link
      href={`/work/${data.slug}`}
      className="group flex h-full flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border)] hover:bg-[var(--color-elevated)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
          {data.eyebrow}
        </p>
        {data.featured ? (
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            aria-label="Featured"
          />
        ) : null}
      </div>
      <h3 className="text-h3 text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
        {data.title}
      </h3>
      <p className="text-body text-[var(--color-fg-muted)]">{data.summary}</p>
      <p className="font-mono text-[12px] text-[var(--color-fg-subtle)]">
        {data.clientFraming} · {data.role}
      </p>
      {data.techTags.length ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {data.techTags.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </Link>
  )
}
