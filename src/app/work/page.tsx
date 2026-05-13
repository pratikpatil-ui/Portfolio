import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { caseStudies, ALL_TAGS } from '@/content/case-studies'
import { CaseStudyCard, type CaseStudyTeaser } from '@/components/work/case-study-card'
import { WorkFilters } from './work-filters'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Nine case studies. AI product UIs, large-scale data viz, React platform migrations, React Native, compliance workflows, multi-tenant marketplaces.',
}

function toTeaser(c: (typeof caseStudies)[number]): CaseStudyTeaser {
  return {
    slug: c.slug,
    eyebrow: c.eyebrow,
    title: c.title,
    summary: c.oneLine,
    clientFraming: c.clientFraming,
    role: c.role,
    techTags: c.stack,
    featured: c.featured,
  }
}

type SearchParams = { tags?: string }

export default async function WorkIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const active = (sp.tags ?? '').split(',').filter(Boolean)
  const filtered =
    active.length === 0
      ? caseStudies
      : caseStudies.filter((c) => c.tags.some((t) => active.includes(t)))

  return (
    <Section>
      <Container size="wide">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
              Work
            </p>
            <h1 className="text-h1 text-[var(--color-fg)]">Nine case studies.</h1>
            <p className="text-body-lg max-w-2xl text-[var(--color-fg-muted)]">
              AI product UIs, large-scale data viz, React 18 platform migrations, React Native,
              compliance workflows, multi-tenant marketplaces, and two solo projects.
            </p>
          </div>

          <Suspense fallback={null}>
            <WorkFilters tags={ALL_TAGS} active={active} />
          </Suspense>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CaseStudyCard key={c.slug} data={toTeaser(c)} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-body text-[var(--color-fg-muted)]">
              No case studies match those filters yet. Clear filters above.
            </p>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
