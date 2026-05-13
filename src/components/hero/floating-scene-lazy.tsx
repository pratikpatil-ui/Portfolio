'use client'

import dynamic from 'next/dynamic'

const FloatingCodeScene = dynamic(
  () => import('./floating-code-scene').then((m) => m.FloatingCodeScene),
  { ssr: false },
)

export function FloatingSceneLazy() {
  return <FloatingCodeScene />
}
