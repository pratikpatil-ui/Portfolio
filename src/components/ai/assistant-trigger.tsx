'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { openAssistant } from '@/lib/events'

const HIDE_ON = ['/contact', '/404']

export function AssistantTrigger() {
  const pathname = usePathname()
  if (HIDE_ON.some((p) => pathname === p)) return null

  return (
    <button
      type="button"
      onClick={openAssistant}
      aria-label="Open assistant"
      className="fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-lg shadow-black/30 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  )
}
