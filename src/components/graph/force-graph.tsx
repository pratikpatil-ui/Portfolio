'use client'

import { useEffect, useRef, useState } from 'react'

type Node = { id: number; degree: number; x?: number; y?: number; fx?: number | null; fy?: number | null }
type Link = { source: number; target: number }

function seededRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function buildGraph(n: number, m: number, seed = 7): { nodes: Node[]; links: Link[] } {
  const rng = seededRng(seed)
  const nodes: Node[] = []
  const links: Link[] = []
  const degree: number[] = []

  for (let i = 0; i < n; i++) {
    nodes.push({ id: i, degree: 0 })
    degree.push(0)
  }

  function inc(arr: number[], i: number) {
    arr[i] = (arr[i] ?? 0) + 1
  }

  // Seed clique: 3 mutually connected hubs.
  for (let a = 0; a < 3; a++) {
    for (let b = a + 1; b < 3; b++) {
      links.push({ source: a, target: b })
      inc(degree, a)
      inc(degree, b)
    }
  }

  // Preferential attachment: each new node connects to ~3 existing, biased by degree.
  for (let i = 3; i < n; i++) {
    const edges = Math.min(3, i)
    const chosen = new Set<number>()
    const totalDegree = links.length * 2 || 1
    let attempts = 0
    while (chosen.size < edges && attempts < 60) {
      attempts++
      const r = rng() * totalDegree
      let acc = 0
      let target = i - 1
      for (let j = 0; j < i; j++) {
        acc += (degree[j] ?? 0) + 1
        if (r <= acc) {
          target = j
          break
        }
      }
      if (target === i || chosen.has(target)) continue
      chosen.add(target)
      links.push({ source: i, target })
      inc(degree, i)
      inc(degree, target)
    }
  }

  // Extra random edges to bring up edge count.
  while (links.length < m && links.length < n * 3) {
    const a = Math.floor(rng() * n)
    const b = Math.floor(rng() * n)
    if (a === b) continue
    links.push({ source: a, target: b })
    inc(degree, a)
    inc(degree, b)
  }

  for (let i = 0; i < n; i++) {
    const node = nodes[i]
    if (node) node.degree = degree[i] ?? 0
  }
  return { nodes, links }
}

function degreeColor(degree: number, maxDegree: number) {
  const t = Math.min(1, degree / Math.max(1, maxDegree))
  const hue = 200 + (75 - 200) * t
  const light = 0.62 + 0.18 * t
  const chroma = 0.13
  return `oklch(${light.toFixed(2)} ${chroma} ${hue.toFixed(0)})`
}

type Props = {
  nodeCount?: number
  linkCount?: number
  height?: number
}

export function ForceGraph({ nodeCount = 1000, linkCount = 2400, height = 600 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [paused, setPaused] = useState(false)
  const [hubCount, setHubCount] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 720
    const N = isMobile ? Math.min(500, nodeCount) : nodeCount
    const M = isMobile ? Math.floor(linkCount * 0.5) : linkCount

    const { nodes, links } = buildGraph(N, M)
    const maxDegree = nodes.reduce((m, n) => Math.max(m, n.degree), 1)
    setHubCount(nodes.filter((n) => n.degree > Math.max(6, maxDegree * 0.4)).length)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = container.clientWidth
    const canvasHeight = height
    let positions: Float32Array<ArrayBufferLike> = new Float32Array(N * 2)
    const transform = { x: 0, y: 0, k: 1 }
    let running = !prefersReduced
    let raf = 0
    let highlighted: Set<number> | null = null
    let dragging: number | null = null
    let pointerDown = false
    let lastPan: { x: number; y: number } | null = null

    function resize() {
      if (!canvas || !container) return
      width = container.clientWidth
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(canvasHeight * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${canvasHeight}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      transform.x = width / 2
      transform.y = canvasHeight / 2
    }

    function draw() {
      if (!ctx) return
      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, canvasHeight)
      ctx.translate(transform.x, transform.y)
      ctx.scale(transform.k, transform.k)

      // edges
      ctx.lineWidth = 0.6 / transform.k
      ctx.strokeStyle = 'oklch(0.30 0.010 60 / 0.18)'
      ctx.beginPath()
      for (const link of links) {
        const ax = positions[link.source * 2]
        const ay = positions[link.source * 2 + 1]
        const bx = positions[link.target * 2]
        const by = positions[link.target * 2 + 1]
        if (ax === undefined || ay === undefined || bx === undefined || by === undefined) continue
        if (highlighted && !(highlighted.has(link.source) && highlighted.has(link.target))) continue
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
      }
      ctx.stroke()

      // nodes
      for (let i = 0; i < N; i++) {
        const x = positions[i * 2]
        const y = positions[i * 2 + 1]
        if (x === undefined || y === undefined) continue
        const node = nodes[i]!
        const r = Math.max(2, Math.min(8, 2 + Math.sqrt(node.degree)))
        const dimmed = highlighted && !highlighted.has(i)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = dimmed
          ? 'oklch(0.55 0.008 80 / 0.25)'
          : degreeColor(node.degree, maxDegree)
        ctx.fill()
      }

      ctx.restore()
    }

    function screenToWorld(px: number, py: number) {
      return {
        x: (px - transform.x) / transform.k,
        y: (py - transform.y) / transform.k,
      }
    }

    function hit(px: number, py: number): number | null {
      const { x, y } = screenToWorld(px, py)
      const tol = 6 / transform.k
      let best: { i: number; d2: number } | null = null
      for (let i = 0; i < N; i++) {
        const nx = positions[i * 2]
        const ny = positions[i * 2 + 1]
        if (nx === undefined || ny === undefined) continue
        const dx = nx - x
        const dy = ny - y
        const d2 = dx * dx + dy * dy
        if (d2 < tol * tol && (!best || d2 < best.d2)) best = { i, d2 }
      }
      return best?.i ?? null
    }

    function highlightNeighbors(id: number) {
      const adj = new Map<number, number[]>()
      for (const l of links) {
        if (!adj.has(l.source)) adj.set(l.source, [])
        if (!adj.has(l.target)) adj.set(l.target, [])
        adj.get(l.source)!.push(l.target)
        adj.get(l.target)!.push(l.source)
      }
      const set = new Set<number>([id])
      for (const n of adj.get(id) ?? []) {
        set.add(n)
        for (const nn of adj.get(n) ?? []) set.add(nn)
      }
      highlighted = set
    }

    const worker = new Worker(new URL('./force-simulation.worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = (e: MessageEvent) => {
      positions = e.data as Float32Array
      draw()
    }
    worker.postMessage({
      type: 'init',
      nodes: nodes.map((n) => ({ id: n.id, degree: n.degree })),
      links: links.map((l) => ({ source: l.source, target: l.target })),
      ticks: 220,
    })

    function loop() {
      if (running && !document.hidden && !paused) {
        worker.postMessage({ type: 'tick' })
      }
      raf = requestAnimationFrame(loop)
    }

    function onPointerDown(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const id = hit(px, py)
      pointerDown = true
      canvas!.setPointerCapture(e.pointerId)
      if (id !== null) {
        dragging = id
        const w = screenToWorld(px, py)
        worker.postMessage({ type: 'drag', id, x: w.x, y: w.y })
      } else {
        lastPan = { x: e.clientX, y: e.clientY }
      }
    }
    function onPointerMove(e: PointerEvent) {
      if (!pointerDown) return
      const rect = canvas!.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      if (dragging !== null) {
        const w = screenToWorld(px, py)
        worker.postMessage({ type: 'drag', id: dragging, x: w.x, y: w.y })
      } else if (lastPan) {
        transform.x += e.clientX - lastPan.x
        transform.y += e.clientY - lastPan.y
        lastPan = { x: e.clientX, y: e.clientY }
        draw()
      }
    }
    function onPointerUp(e: PointerEvent) {
      pointerDown = false
      canvas!.releasePointerCapture(e.pointerId)
      if (dragging !== null) {
        worker.postMessage({ type: 'release', id: dragging })
        dragging = null
      }
      lastPan = null
    }
    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      const id = hit(e.clientX - rect.left, e.clientY - rect.top)
      if (id !== null) {
        highlightNeighbors(id)
      } else {
        highlighted = null
      }
      draw()
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const rect = canvas!.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const world = screenToWorld(px, py)
      const factor = Math.exp(-e.deltaY * 0.001)
      const next = Math.max(0.3, Math.min(4, transform.k * factor))
      transform.k = next
      transform.x = px - world.x * next
      transform.y = py - world.y * next
      draw()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry?.isIntersecting === true && !prefersReduced
      },
      { threshold: 0.05 },
    )
    io.observe(container)

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    raf = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      worker.terminate()
      io.disconnect()
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [nodeCount, linkCount, height, paused])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-muted)] bg-[var(--color-surface)]"
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block cursor-grab touch-none active:cursor-grabbing" />
      <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1 font-mono text-[11px] text-[var(--color-fg-subtle)]">
        <span>nodes: {nodeCount.toLocaleString()}</span>
        <span>hubs: {hubCount}</span>
        <span>scroll to zoom · drag to pan or pull a node</span>
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]/70 px-2 py-1 font-mono text-[11px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  )
}
