import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { ForceGraph } from '@/components/graph/force-graph'
import { TokenStreaming } from '@/components/lab/token-streaming'
import { ThemeTokens } from '@/components/lab/theme-tokens'
import { getDemo, labDemos } from '@/content/lab'

export function generateStaticParams() {
  return labDemos.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const d = getDemo(slug)
  if (!d) return { title: 'Demo' }
  return {
    title: d.title,
    description: d.description,
  }
}

export default async function LabDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const demo = getDemo(slug)
  if (!demo) notFound()

  return (
    <Section>
      <Container size="wide">
        <div className="flex flex-col gap-6">
          <Link
            href="/lab"
            className="font-mono text-[12px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
          >
            ← Back to lab
          </Link>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-widest text-[var(--color-accent)] uppercase">
              {demo.eyebrow}
            </p>
            <h1 className="text-h1 text-[var(--color-fg)]">{demo.title}</h1>
            <p className="text-body-lg text-[var(--color-fg-muted)]">{demo.description}</p>
          </div>

          {demo.slug === 'force-graph-mini' ? <ForceGraphSection /> : null}
          {demo.slug === 'token-streaming-sandbox' ? <TokenStreaming /> : null}
          {demo.slug === 'theme-tokens' ? <ThemeTokens /> : null}
        </div>
      </Container>
    </Section>
  )
}

function ForceGraphSection() {
  return (
    <div className="flex flex-col gap-3">
      <ForceGraph nodeCount={1000} height={620} />
      <p className="text-body text-[var(--color-fg-muted)]">
        Production version renders 10K nodes against live S3 streams in a regulated banking SaaS.
        This is a 1K-node sanitized recreation, same rendering pipeline, same force-in-worker
        architecture.
      </p>
    </div>
  )
}
