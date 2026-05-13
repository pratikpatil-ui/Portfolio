import { createElement, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Section({
  children,
  className,
  as = 'section',
  id,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  id?: string
}) {
  return createElement(
    as,
    { id, className: cn('py-16 sm:py-24', className) },
    children,
  )
}
