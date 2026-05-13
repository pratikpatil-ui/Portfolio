import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const dynamic = 'force-static'
export const dynamicParams = true

export default async function WorkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <PlaceholderPage
      title={slug}
      phase="Phase 2 placeholder"
      detail="Case study template, diagrams, and metrics ship in Phase 2."
    />
  )
}
