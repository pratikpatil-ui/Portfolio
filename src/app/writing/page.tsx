import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Tag } from '@/components/ui/tag'
import { posts } from '@/content/writing'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Long-form posts on React platform migrations, large-scale data viz, and LLM chat UI primitives.',
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function WritingPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <Section>
      <Container size="narrow">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
            Writing
          </p>
          <h1 className="text-h1 text-[var(--color-fg)]">Long-form on the work.</h1>
          <p className="text-body-lg max-w-2xl text-[var(--color-fg-muted)]">
            Engineering posts. React platform migrations, D3 at scale, and LLM chat UI primitives.
          </p>
        </div>

        <ul className="mt-10 flex flex-col gap-8">
          {sorted.map((p) => (
            <li
              key={p.slug}
              className="flex flex-col gap-2 border-b border-[var(--color-border-muted)] pb-8 last:border-b-0"
            >
              <Link href={`/writing/${p.slug}`} className="group flex flex-col gap-2">
                <h2 className="text-h3 text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
                  {p.title}
                </h2>
                <p className="font-mono text-[12px] text-[var(--color-fg-subtle)]">
                  {fmtDate(p.date)} · {p.readingTime} min read
                </p>
                <p className="text-body text-[var(--color-fg-muted)]">{p.summary}</p>
              </Link>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
