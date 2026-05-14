import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Tag } from '@/components/ui/tag'
import { CodeBlock } from '@/components/ui/code-block'
import { caseStudies, getCaseStudy, getCaseStudySlugs } from '@/content/case-studies'
import { ForceGraph } from '@/components/graph/force-graph'

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return { title: 'Case study' }
  const ogUrl = `/api/og?title=${encodeURIComponent(cs.title)}&eyebrow=${encodeURIComponent(cs.eyebrow)}&subtitle=${encodeURIComponent(cs.oneLine)}`
  return {
    title: cs.title,
    description: cs.oneLine,
    openGraph: { title: cs.title, description: cs.oneLine, images: [{ url: ogUrl }] },
    twitter: { card: 'summary_large_image', title: cs.title, description: cs.oneLine, images: [ogUrl] },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()
  const nextCase = caseStudies.find((c) => c.slug === cs.next)

  return (
    <Section>
      <Container size="narrow">
        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <Link
              href="/work"
              className="font-mono text-[12px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
            >
              ← All work
            </Link>
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
              {cs.eyebrow}
            </p>
            <h1 className="text-h1 text-[var(--color-fg)]">{cs.title}</h1>
            <p className="text-body-lg text-[var(--color-fg-muted)]">{cs.oneLine}</p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 font-mono text-[12px] sm:grid-cols-4">
              <div>
                <dt className="text-[var(--color-fg-subtle)] uppercase">Client</dt>
                <dd className="text-[var(--color-fg-muted)]">{cs.clientFraming}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-fg-subtle)] uppercase">Role</dt>
                <dd className="text-[var(--color-fg-muted)]">{cs.role}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-fg-subtle)] uppercase">Timeline</dt>
                <dd className="text-[var(--color-fg-muted)]">{cs.timeline}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-fg-subtle)] uppercase">Team</dt>
                <dd className="text-[var(--color-fg-muted)]">{cs.teamSize}</dd>
              </div>
            </dl>

            {(cs.liveUrl || cs.repoUrl) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {cs.liveUrl ? (
                  <a
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3 py-1.5 text-caption text-[var(--color-accent-fg)] hover:brightness-110"
                  >
                    View live →
                  </a>
                ) : null}
                {cs.repoUrl ? (
                  <a
                    href={cs.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1.5 text-caption text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                  >
                    View repo →
                  </a>
                ) : null}
              </div>
            )}
          </header>

          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-[var(--color-fg)]">Problem</h2>
            {cs.problem.map((para, i) => (
              <p key={i} className="text-body text-[var(--color-fg-muted)]">
                {para}
              </p>
            ))}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-[var(--color-fg)]">Constraints</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-[var(--color-fg-muted)]">
              {cs.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-[var(--color-fg)]">Decisions</h2>
            <div className="flex flex-col gap-3">
              {cs.decisions.map((d) => (
                <div
                  key={d.chose}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5"
                >
                  <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                    Chose
                  </p>
                  <p className="text-body text-[var(--color-fg)]">{d.chose}</p>
                  <p className="mt-3 font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                    Considered
                  </p>
                  <p className="text-body text-[var(--color-fg-muted)]">{d.considered}</p>
                  <p className="mt-3 font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                    Why
                  </p>
                  <p className="text-body text-[var(--color-fg-muted)]">{d.why}</p>
                </div>
              ))}
            </div>
          </section>

          {cs.codeSample ? (
            <section className="flex flex-col gap-3">
              <h2 className="text-h3 text-[var(--color-fg)]">Code sample</h2>
              <CodeBlock
                code={cs.codeSample.code}
                language={cs.codeSample.language}
                filename={cs.codeSample.filename}
              />
            </section>
          ) : null}

          {cs.liveDemo === 'force-graph' ? (
            <section className="flex flex-col gap-3">
              <h2 className="text-h3 text-[var(--color-fg)]">Live demo</h2>
              <ForceGraph nodeCount={1000} linkCount={2400} height={620} />
              <p className="text-body text-[var(--color-fg-muted)]">
                Full 3D force simulation (d3-force-3d) in a Web Worker, rendered with Three.js as
                instanced spheres plus additive line edges and halo billboards on hubs. The layout
                starts from a singularity and explodes outward; color identifies one of ten
                connected clusters, so the universe reads as a galaxy of communities once it
                cools. 1,000 entities here for a responsive demo. The production banking SaaS uses
                the same force-in-worker pipeline against a million-row customer dataset on S3 and
                streams only the viewport-relevant slice, which is what lets a 10,000-node graph
                paint under a second on a regulated bank&apos;s laptop. Click a node to fly the
                camera in behind it.
              </p>
            </section>
          ) : null}

          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-[var(--color-fg)]">Outcomes</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-[var(--color-fg-muted)]">
              {cs.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-[var(--color-fg)]">What I would do differently</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-[var(--color-fg-muted)]">
              {cs.retro.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h3 text-[var(--color-fg)]">Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {cs.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </section>

          {nextCase ? (
            <Link
              href={`/work/${nextCase.slug}`}
              className="mt-8 flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 hover:bg-[var(--color-elevated)]"
            >
              <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                Next case study
              </p>
              <p className="text-h3 text-[var(--color-fg)]">{nextCase.title}</p>
              <p className="text-body text-[var(--color-fg-muted)]">{nextCase.oneLine}</p>
            </Link>
          ) : null}
        </article>
      </Container>
    </Section>
  )
}
