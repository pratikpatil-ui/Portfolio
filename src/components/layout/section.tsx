import { type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Section({
  children,
  className,
  as: Tag = 'section',
  id,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  id?: string
}) {
  return (
    <Tag id={id} className={cn('py-16 sm:py-24', className)}>
      {children}
    </Tag>
  )
}
