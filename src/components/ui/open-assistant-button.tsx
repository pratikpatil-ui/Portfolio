'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { openAssistant } from '@/lib/events'

const base =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

type Variant = 'primary' | 'secondary' | 'ghost'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:brightness-110 border border-transparent',
  secondary:
    'bg-[var(--color-elevated)] text-[var(--color-fg)] border border-[var(--color-border)] hover:border-[var(--color-fg-muted)]',
  ghost:
    'bg-transparent text-[var(--color-fg-muted)] border border-[var(--color-border)] hover:text-[var(--color-fg)] hover:border-[var(--color-fg-muted)]',
}

export function OpenAssistantButton({
  variant = 'secondary',
  className,
  children,
}: {
  variant?: Variant
  className?: string
  children: ReactNode
}) {
  return (
    <button type="button" onClick={openAssistant} className={cn(base, variants[variant], className)}>
      {children}
    </button>
  )
}
