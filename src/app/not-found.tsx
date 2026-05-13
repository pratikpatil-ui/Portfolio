import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

export const metadata = { title: 'Not found' }

export default function NotFound() {
  return (
    <Section>
      <Container size="narrow">
        <div className="flex max-w-[560px] flex-col gap-5">
          <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
            404
          </p>
          <h1 className="text-h1 text-[var(--color-fg)]">That node isn&apos;t in the graph.</h1>
          <p className="text-body-lg text-[var(--color-fg-muted)]">
            The page you were looking for has disconnected. Try the home page or the work index.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-caption font-medium text-[var(--color-accent-fg)] hover:brightness-110"
            >
              Back to home
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-2 text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              Browse the work
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
