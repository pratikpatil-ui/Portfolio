import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  variant?: 'sage' | 'gold' | 'warm'
}

/**
 * Text component with gradient effect
 * Uses CSS background-clip for gradient text
 *
 * @param variant - Gradient color scheme
 */
export function GradientText({
  children,
  className,
  variant = 'sage',
}: GradientTextProps) {
  const gradients = {
    sage: 'from-[#4C8572] via-[#5FCCBA] to-[#4C8572]',  // Sage gradient
    gold: 'from-[#F2B647] via-[#D89F34] to-[#F2B647]',  // Gold gradient
    warm: 'from-[#F2B647] via-[#D4A373] to-[#C97A5F]',  // Warm gold to rust
  }

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
