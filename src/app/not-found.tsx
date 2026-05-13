import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4">
          <p className="text-micro tracking-widest text-[var(--color-fg-subtle)] uppercase">404</p>
          <h1 className="text-h1 text-[var(--color-fg)]">Page not found</h1>
          <p className="text-body text-[var(--color-fg-muted)]">
            The page you asked for does not exist. The interactive 404 ships in Phase 5.
          </p>
          <Link
            href="/"
            className="text-caption text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            Back home
          </Link>
        </div>
      </Container>
    </Section>
  )
}
