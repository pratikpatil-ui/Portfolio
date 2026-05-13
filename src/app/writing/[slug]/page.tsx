import { PlaceholderPage } from '@/components/layout/placeholder-page'

export const dynamic = 'force-static'
export const dynamicParams = true

export default async function WritingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <PlaceholderPage
      title={slug}
      phase="Phase 3 placeholder"
      detail="Post detail page with MDX rendering ships in Phase 3."
    />
  )
}
