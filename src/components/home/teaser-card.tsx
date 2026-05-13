import Link from 'next/link'

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
      className="group flex h-full flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border)] hover:bg-[var(--color-elevated)]"
    >
      <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
        {eyebrow}
      </p>
      <h3 className="text-h3 text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
        {title}
      </h3>
      <p className="text-body text-[var(--color-fg-muted)]">{description}</p>
      {meta ? (
        <p className="mt-auto pt-2 font-mono text-[12px] text-[var(--color-fg-subtle)]">{meta}</p>
      ) : null}
    </Link>
  )
}
