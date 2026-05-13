import { Container } from './container'
import { Section } from './section'

export function PlaceholderPage({
  title,
  phase,
  detail,
}: {
  title: string
  phase: string
  detail?: string
}) {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-3">
          <p className="text-micro tracking-widest text-[var(--color-fg-subtle)] uppercase">
            {phase}
          </p>
          <h1 className="text-h1 text-[var(--color-fg)]">{title}</h1>
          {detail ? <p className="text-body text-[var(--color-fg-muted)]">{detail}</p> : null}
        </div>
      </Container>
    </Section>
  )
}
