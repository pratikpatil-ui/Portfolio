import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode
  className?: string
  size?: 'narrow' | 'default' | 'wide'
}) {
  const max = size === 'narrow' ? 'max-w-2xl' : size === 'wide' ? 'max-w-6xl' : 'max-w-4xl'
  return <div className={cn('mx-auto w-full px-5 sm:px-8', max, className)}>{children}</div>
}
