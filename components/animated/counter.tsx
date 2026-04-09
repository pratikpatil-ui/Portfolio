'use client'

import { useEffect, useRef, useState } from 'react'
import { useIntersection } from '@/hooks/use-intersection'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

/**
 * Animated counter component
 * Counts from 0 to end value when scrolled into view
 *
 * @param end - Target number to count to
 * @param duration - Animation duration in ms
 * @param suffix - Text to append after number (e.g., '%', '+')
 * @param prefix - Text to prepend before number (e.g., '$')
 */
export function Counter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(0)
  const { ref, isIntersecting } = useIntersection(0.5, true)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (isIntersecting && !hasStarted.current) {
      hasStarted.current = true
      let startTime: number | null = null
      const startValue = 0

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        // Easing function (easeOutCubic)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeOut * (end - startValue) + startValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isIntersecting, end, duration])

  return (
    <span ref={ref as any} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
