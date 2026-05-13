'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const h = document.documentElement
      const scrolled = h.scrollTop
      const total = h.scrollHeight - h.clientHeight
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed top-0 right-0 left-0 z-30 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-[var(--color-accent)] transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
