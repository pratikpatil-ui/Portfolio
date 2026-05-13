'use client'

import { useEffect, useRef } from 'react'

type Node = { x: number; y: number; vx: number; vy: number; r: number; a: number }

export function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let nodes: Node[] = []
    let raf = 0
    let running = true
    const mouse = { x: -9999, y: -9999, active: false }

    function getCssColor(varName: string) {
      try {
        return getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim()
      } catch {
        return 'rgba(255,255,255,0.5)'
      }
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const isMobile = width < 720
      const count = isMobile ? 60 : 150
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 0.6 + Math.random() * 1.4,
        a: 0.3 + Math.random() * 0.5,
      }))
    }

    function step() {
      if (!running) return
      ctx!.clearRect(0, 0, width, height)
      const color = getCssColor('--color-fg-subtle') || 'oklch(0.55 0.008 80)'
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        if (mouse.active && !isTouch) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < 120 * 120 && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (120 - d) / 120
            n.x += (dx / d) * force * 0.4
            n.y += (dy / d) * force * 0.4
          }
        }

        if (n.x < -2) n.x = width + 2
        if (n.x > width + 2) n.x = -2
        if (n.y < -2) n.y = height + 2
        if (n.y > height + 2) n.y = -2

        ctx!.beginPath()
        ctx!.fillStyle = color
        ctx!.globalAlpha = n.a
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height)
      const color = getCssColor('--color-fg-subtle') || 'oklch(0.55 0.008 80)'
      for (const n of nodes) {
        ctx!.beginPath()
        ctx!.fillStyle = color
        ctx!.globalAlpha = n.a
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
    }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    function onLeave() {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }
    function onVisibility() {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!prefersReduced) {
        running = true
        raf = requestAnimationFrame(step)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    if (!isTouch) {
      window.addEventListener('mousemove', onMouse)
      window.addEventListener('mouseleave', onLeave)
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (prefersReduced) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  )
}
