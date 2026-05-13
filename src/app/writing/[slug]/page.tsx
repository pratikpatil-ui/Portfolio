import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { Tag } from '@/components/ui/tag'
import { Markdown } from '@/components/writing/markdown'
import { ReadingProgress } from '@/components/writing/reading-progress'
import { getPost, getPostSlugs, posts } from '@/content/writing'
import { SITE_URL } from '@/lib/constants'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = getPost(slug)
  if (!p) return { title: 'Post' }
  const ogUrl = `/api/og?title=${encodeURIComponent(p.title)}&eyebrow=${encodeURIComponent('Writing')}&minutes=${p.readingTime}`
  return {
    title: p.title,
    description: p.summary,
    openGraph: {
      title: p.title,
      description: p.summary,
      type: 'article',
      publishedTime: p.date,
      images: [{ url: ogUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.summary,
      images: [ogUrl],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const idx = posts.findIndex((p) => p.slug === post.slug)
  const next = posts[idx + 1]
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: 'Pratik Patil', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Pratik Patil', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/writing/${post.slug}` },
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <ReadingProgress />
      <Section>
        <Container size="narrow">
          <article className="flex flex-col gap-6">
            <header className="flex flex-col gap-3">
              <Link
                href="/writing"
                className="font-mono text-[12px] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
              >
                ← All posts
              </Link>
              <h1 className="text-h1 text-[var(--color-fg)]">{post.title}</h1>
              <p className="font-mono text-[12px] text-[var(--color-fg-subtle)]">
                {fmtDate(post.date)} · {post.readingTime} min read
              </p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </header>

            <Markdown source={post.body} />

            <footer className="mt-8 border-t border-[var(--color-border-muted)] pt-6 text-body text-[var(--color-fg-muted)]">
              Have feedback? Email me at{' '}
              <a
                href="mailto:pratikpatilui@gmail.com"
                className="text-[var(--color-accent)] hover:underline"
              >
                pratikpatilui@gmail.com
              </a>
              .
            </footer>

            {next ? (
              <Link
                href={`/writing/${next.slug}`}
                className="mt-6 flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)] p-5 hover:bg-[var(--color-elevated)]"
              >
                <p className="font-mono text-[11px] tracking-widest text-[var(--color-fg-subtle)] uppercase">
                  Next post
                </p>
                <p className="text-h3 text-[var(--color-fg)]">{next.title}</p>
                <p className="text-body text-[var(--color-fg-muted)]">{next.summary}</p>
              </Link>
            ) : null}
          </article>
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  )
}
