import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { caseStudies } from '@/content/case-studies'
import { labDemos } from '@/content/lab'
import { posts } from '@/content/writing'

const STATIC = [
  '/',
  '/work',
  '/lab',
  '/writing',
  '/now',
  '/about',
  '/resume',
  '/contact',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base = STATIC.map((route) => ({
    url: `${SITE_URL}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '/' ? 1 : 0.7,
  }))
  const work = caseStudies.map((c) => ({
    url: `${SITE_URL}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  const lab = labDemos.map((d) => ({
    url: `${SITE_URL}/lab/${d.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  const writing = posts.map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  return [...base, ...work, ...lab, ...writing]
}
