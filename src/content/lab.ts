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
    title: '3D force-directed universe with click-to-fly viewpoint',
    description:
      'd3-force-3d in a Web Worker, Three.js renderer with instanced nodes, additive line edges, and halo billboards on hubs. Ten color-coded clusters, draggable nodes, and a click that flies the camera in behind the selected node. Same pipeline as the production 10K-node banking graph, virtualized from a million rows on S3.',
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
