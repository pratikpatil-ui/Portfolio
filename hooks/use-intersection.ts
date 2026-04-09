import { useEffect, useRef, useState } from 'react'

/**
 * Hook to detect when an element enters the viewport
 * Useful for triggering scroll reveal animations
 *
 * @param threshold - Percentage of element visibility (0-1) to trigger
 * @param triggerOnce - Whether to only trigger once
 * @returns ref to attach to element and isIntersecting state
 */
export function useIntersection(
  threshold = 0.1,
  triggerOnce = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, triggerOnce])

  return { ref, isIntersecting }
}
