export type LabDemo = {
  slug: 'force-graph-mini' | 'token-streaming-sandbox' | 'theme-tokens'
  eyebrow: string
  title: string
  description: string
  meta: string
}

export const labDemos: LabDemo[] = [
  {
    slug: 'force-graph-mini',
    eyebrow: 'Force graph',
    title: '1K-node version of the production D3 graph',
    description:
      'Canvas, force in a Web Worker, drag, zoom, pan. Same rendering pipeline as the 10K-node banking SaaS graph, on a sanitized dataset.',
    meta: 'Live demo',
  },
  {
    slug: 'token-streaming-sandbox',
    eyebrow: 'LLM UI',
    title: 'Token streaming sandbox',
    description:
      'Adjustable words-per-second to see what 10, 25, and 60 WPS feel like in an LLM chat surface. The wait is half the UI.',
    meta: 'Live demo',
  },
  {
    slug: 'theme-tokens',
    eyebrow: 'Design system',
    title: 'Live-tweak this site’s design tokens',
    description:
      'OKLCH sliders for background, foreground, accent, and AI accent. Copy the result as a CSS block.',
    meta: 'Live demo',
  },
]

export function getDemo(slug: string): LabDemo | undefined {
  return labDemos.find((d) => d.slug === slug)
}
