'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

type Node = { x: number; y: number; vx: number; vy: number; r: number }
type Pulse = { from: number; to: number; t: number; dur: number }

type Palette = {
  node: string
  nodeDim: string
  edge: (alpha: number) => string
  pulse: string
}

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    node: 'rgba(95, 204, 186, 0.9)',
    nodeDim: 'rgba(95, 204, 186, 0.45)',
    edge: (a) => `rgba(95, 204, 186, ${a.toFixed(3)})`,
    pulse: 'rgba(242, 182, 71, 0.95)',
  },
  light: {
    node: 'rgba(76, 133, 114, 0.85)',
    nodeDim: 'rgba(76, 133, 114, 0.4)',
    edge: (a) => `rgba(76, 133, 114, ${a.toFixed(3)})`,
    pulse: 'rgba(216, 159, 52, 0.95)',
  },
}

export function HeroNetwork() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let pulses: Pulse[] = []
    let raf = 0
    let running = true
    let lastPulseAt = 0
    const mouse = { x: -9999, y: -9999, active: false }

    let palette: Palette =
      PALETTES[resolvedTheme === 'light' ? 'light' : 'dark']

    function paletteFromTheme() {
      palette = PALETTES[resolvedTheme === 'light' ? 'light' : 'dark']
    }

    function resize() {
      const rect = container!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = width < 720
      const count = isMobile ? 32 : 56
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1.4 + Math.random() * 1.6,
      }))
    }

    function tick(now: number) {
      if (!running) return
      ctx!.clearRect(0, 0, width, height)

      // drift + cursor attraction
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        if (mouse.active && !isTouch) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < 160 * 160 && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (160 - d) / 160
            n.x += (dx / d) * force * 0.35
            n.y += (dy / d) * force * 0.35
          }
        }

        if (n.x < -4) n.x = width + 4
        if (n.x > width + 4) n.x = -4
        if (n.y < -4) n.y = height + 4
        if (n.y > height + 4) n.y = -4
      }

      // edges
      const linkDist = width < 720 ? 130 : 170
      const ld2 = linkDist * linkDist
      ctx!.lineWidth = 0.7
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < ld2) {
            const alpha = (1 - d2 / ld2) * 0.18
            ctx!.strokeStyle = palette.edge(alpha)
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // pulses
      if (now - lastPulseAt > 2200 && pulses.length < 3 && nodes.length > 2) {
        lastPulseAt = now
        const from = Math.floor(Math.random() * nodes.length)
        // pick a relatively close target
        let to = (from + 1) % nodes.length
        let bestD = Infinity
        for (let k = 0; k < 8; k++) {
          const cand = Math.floor(Math.random() * nodes.length)
          if (cand === from) continue
          const a = nodes[from]!
          const b = nodes[cand]!
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
          if (d2 < bestD && d2 < ld2) {
            bestD = d2
            to = cand
          }
        }
        pulses.push({ from, to, t: 0, dur: 1100 + Math.random() * 800 })
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]!
        const a = nodes[p.from]
        const b = nodes[p.to]
        if (!a || !b) {
          pulses.splice(i, 1)
          continue
        }
        p.t += 16 / p.dur
        if (p.t >= 1) {
          pulses.splice(i, 1)
          continue
        }
        const ease = p.t * p.t * (3 - 2 * p.t)
        const x = a.x + (b.x - a.x) * ease
        const y = a.y + (b.y - a.y) * ease
        ctx!.fillStyle = palette.pulse
        ctx!.beginPath()
        ctx!.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx!.fill()
      }

      // nodes
      for (const n of nodes) {
        const nearCursor =
          mouse.active &&
          (mouse.x - n.x) ** 2 + (mouse.y - n.y) ** 2 < 130 * 130
        ctx!.fillStyle = nearCursor ? palette.node : palette.nodeDim
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height)
      const ld2 = (width < 720 ? 130 : 170) ** 2
      ctx!.lineWidth = 0.7
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2
          if (d2 < ld2) {
            const alpha = (1 - d2 / ld2) * 0.18
            ctx!.strokeStyle = palette.edge(alpha)
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
        ctx!.fillStyle = palette.nodeDim
        ctx!.beginPath()
        ctx!.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function onMouse(e: MouseEvent) {
      const rect = container!.getBoundingClientRect()
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
        raf = requestAnimationFrame(tick)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (prefersReduced) return
        if (entry?.isIntersecting) {
          if (!running) {
            running = true
            raf = requestAnimationFrame(tick)
          }
        } else {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.01 },
    )
    io.observe(container)

    resize()
    window.addEventListener('resize', resize)
    if (!isTouch) {
      container.addEventListener('mousemove', onMouse)
      container.addEventListener('mouseleave', onLeave)
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (prefersReduced) {
      paletteFromTheme()
      drawStatic()
    } else {
      raf = requestAnimationFrame(tick)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', onMouse)
      container.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [resolvedTheme])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
