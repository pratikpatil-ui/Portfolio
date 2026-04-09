'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useIntersection } from '@/hooks/use-intersection'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: ReactNode
  id?: string
  className?: string
  background?: 'default' | 'sage' | 'card'
  animated?: boolean
}

/**
 * Reusable section wrapper component
 * Provides consistent padding, spacing, and optional scroll animations
 *
 * @param background - Section background variant
 * @param animated - Whether to apply scroll reveal animation
 */
export function SectionWrapper({
  children,
  id,
  className,
  background = 'default',
  animated = true,
}: SectionWrapperProps) {
  const { ref, isIntersecting } = useIntersection(0.1, true)

  const backgrounds = {
    default: 'bg-background',
    sage: 'bg-[hsl(var(--sage-wash))]',
    card: 'bg-card',
  }

  const content = (
    <section
      id={id}
      className={cn(
        'py-section-lg',
        backgrounds[background],
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  )

  if (!animated) {
    return content
  }

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 40 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  )
}
