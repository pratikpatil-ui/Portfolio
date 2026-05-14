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
      <ForceGraph nodeCount={1000} linkCount={2400} height={640} />
      <p className="text-body text-[var(--color-fg-muted)]">
        Full 3D force simulation in d3-force-3d running inside a Web Worker. Rendering is
        Three.js: instanced sphere nodes, additive line edges, additive halo billboards on hubs.
        The layout starts from a singularity at the origin and explodes outward as the force
        cools, and color identifies one of ten connected clusters so the universe reads as a
        galaxy of communities once it settles. 1,000 entities here for a responsive offline demo.
        In the production banking SaaS this same force-in-worker pipeline backs a 10,000-node
        graph drawn from a million-row customer dataset on S3, streamed in by viewport slice so
        first paint stays under a second no matter how large the underlying dataset grows. Drag
        empty space to orbit, scroll to zoom, drag a node to move it in 3D, click a node to fly
        the camera in behind it.
      </p>
    </div>
  )
}
