import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { TeaserCard } from '@/components/home/teaser-card'
import { labDemos } from '@/content/lab'

export const metadata: Metadata = {
  title: 'Lab',
  description:
    'Interactive demos: a 1K-node force graph, an LLM token streaming sandbox, and a live design-token tweaker.',
}

export default function LabPage() {
  return (
    <Section>
      <Container size="wide">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Lab
            </p>
            <h1 className="text-h1 text-[var(--color-fg)]">Demos you can poke at.</h1>
            <p className="text-body-lg max-w-2xl text-[var(--color-fg-muted)]">
              Three interactive demos. The first is a sanitized recreation of the production graph
              that ships in a regulated banking SaaS. The other two are small tools I built to
              think through specific UI problems.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labDemos.map((d) => (
              <TeaserCard
                key={d.slug}
                href={`/lab/${d.slug}`}
                eyebrow={d.eyebrow}
                title={d.title}
                description={d.description}
                meta={d.meta}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
