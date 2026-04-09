import { useEffect, useState } from 'react'

/**
 * Hook to track scroll progress as a percentage
 * Returns a value between 0 and 1
 * Useful for scroll indicators and progress bars
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0
      setProgress(progress)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progress
}

/**
 * Hook to get current scroll position
 * Returns the Y scroll position
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', updatePosition)
    updatePosition()

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollY
}
