'use client'

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { generateUniverse, GROUP_COLORS_HEX } from './universe-data'

// react-force-graph-3d touches `window` at module load time, so it must be
// dynamically imported with SSR disabled. The library uses generic types that
// don't flow cleanly through next/dynamic, so we strip the generics at the
// boundary and rely on our own GraphNode/GraphLink shapes inside.
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => null,
}) as unknown as ComponentType<Record<string, unknown>>

type ForceGraphRef = {
  cameraPosition: (
    pos: Partial<{ x: number; y: number; z: number }>,
    lookAt?: { x: number; y: number; z: number },
    transitionMs?: number,
  ) => void
  zoomToFit: (transitionMs?: number, padding?: number) => void
}

type GraphNode = {
  id: number
  group: number
  type: number
  degree: number
  x?: number
  y?: number
  z?: number
}
type GraphLink = { source: GraphNode; target: GraphNode }

type Props = {
  nodeCount?: number
  linkCount?: number
  height?: number
}

const BG_CSS = '#14110d'

// Business-facing labels for the synthetic entity types so the search and
// tooltip read like a customer data platform, not a graph theory toy.
function businessLabel(type: number): string {
  return type === 0 ? 'Organization' : type === 1 ? 'Account' : 'Customer'
}

export function ForceGraph({ nodeCount = 1000, linkCount = 2400, height = 640 }: Props) {
  const dataset = useMemo(() => generateUniverse(nodeCount, linkCount, 42), [nodeCount, linkCount])

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = []
    for (let i = 0; i < dataset.n; i++) {
      nodes.push({
        id: i,
        group: dataset.group[i] ?? 0,
        type: dataset.type[i] ?? 2,
        degree: dataset.degree[i] ?? 0,
      })
    }
    // Pre-resolve link source/target to the actual node references rather
    // than numeric ids. The library otherwise re-resolves on every reheat
    // (which happens on every drag), and a transient unresolved state during
    // a reheat is what causes the "reading 'x'" error when the tick reads
    // link.source.x on a node that was momentarily undefined.
    const links: GraphLink[] = []
    for (let i = 0; i < dataset.m; i++) {
      const s = nodes[dataset.linkSource[i] ?? 0]
      const t = nodes[dataset.linkTarget[i] ?? 0]
      if (s && t) links.push({ source: s, target: t })
    }
    return { nodes, links }
  }, [dataset])

  // ResizeObserver feeds explicit dimensions into ForceGraph3D, which would
  // otherwise default to the full window.
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height: h } = entry.contentRect
      setSize({ w: Math.floor(width), h: Math.floor(h) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fgRef = useRef<ForceGraphRef | null>(null)

  // Frame the whole universe in the camera once after the warmup ticks have
  // largely settled the layout. zoomToFit walks the bounding box and animates
  // the camera to fit, which is the structured first impression vasturiano
  // demos rely on.
  useEffect(() => {
    if (size.w === 0 || size.h === 0) return
    const t1 = window.setTimeout(() => {
      fgRef.current?.zoomToFit(2200, 120)
    }, 600)
    return () => window.clearTimeout(t1)
  }, [size.w, size.h, graphData])

  // Camera fly to a clicked node. Camera lands along the radial vector from
  // origin through the node so the rest of the universe spreads out behind
  // it. Exact pattern from the vasturiano onNodeClick example.
  function handleNodeClick(node: GraphNode | null | undefined) {
    // The library can pass null / undefined during transient states (a node
    // being removed under a click, or a hot-reload race). Bail before reading
    // position fields, since `node.x` on `undefined` throws.
    if (!node || typeof node !== 'object') return
    const distance = 50
    const x = node.x ?? 0
    const y = node.y ?? 0
    const z = node.z ?? 0
    const len = Math.hypot(x, y, z)
    const distRatio = 1 + distance / (len || 1)
    const newPos =
      x || y || z
        ? { x: x * distRatio, y: y * distRatio, z: z * distRatio }
        : { x: 0, y: 0, z: distance }
    fgRef.current?.cameraPosition(newPos, { x, y, z }, 1500)
  }

  // Hover tooltip body. Uses the same cluster color as the node sphere so the
  // analyst can match the tooltip back to the segment they are looking at.
  function nodeLabel(node: GraphNode | null | undefined): string {
    if (!node || typeof node !== 'object') return ''
    const businessType = businessLabel(node.type)
    const color = GROUP_COLORS_HEX[node.group] ?? GROUP_COLORS_HEX[0]
    return `
      <div style="
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 11px;
        line-height: 1.5;
        padding: 8px 10px;
        border: 1px solid #3a2a1c;
        background: rgba(26, 20, 16, 0.96);
        color: #e7c693;
        border-radius: 6px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      ">
        <div style="display: flex; align-items: center; gap: 6px; color: #f3c969; letter-spacing: 0.08em; text-transform: uppercase; font-size: 10px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${color}; box-shadow: 0 0 6px ${color};"></span>
          ${businessType} #${node.id}
        </div>
        <div style="color: #c9a978; margin-top: 4px;">
          ${node.degree} connections &middot; segment ${node.group}
        </div>
      </div>
    `
  }

  // Search state.
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const searchResults = useMemo<GraphNode[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    const matches: GraphNode[] = []
    for (const n of graphData.nodes) {
      const idStr = String(n.id)
      const typeName = businessLabel(n.type).toLowerCase()
      const segLabel = `segment ${n.group}`
      if (idStr.includes(q) || typeName.startsWith(q) || segLabel.includes(q)) {
        matches.push(n)
      }
    }
    matches.sort((a, b) => {
      const aExact = String(a.id) === q ? 0 : 1
      const bExact = String(b.id) === q ? 0 : 1
      if (aExact !== bExact) return aExact - bExact
      // Then by degree desc so the most-connected matches surface first.
      return b.degree - a.degree
    })
    return matches.slice(0, 8)
  }, [searchQuery, graphData])

  function handleSearchSelect(node: GraphNode) {
    setSearchQuery('')
    setShowResults(false)
    handleNodeClick(node)
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-muted)]"
      style={{ height, background: BG_CSS }}
    >
      {size.w > 0 && size.h > 0 ? (
        <ForceGraph3D
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={graphData}
          backgroundColor={BG_CSS}
          controlType="orbit"
          showNavInfo={false}
          nodeRelSize={6}
          nodeVal={((n: GraphNode) => 1 + Math.sqrt(n.degree) * 1.6) as unknown as Record<string, unknown>}
          nodeColor={
            ((n: GraphNode) =>
              GROUP_COLORS_HEX[n.group] ?? GROUP_COLORS_HEX[0]) as unknown as Record<string, unknown>
          }
          nodeLabel={nodeLabel as unknown as Record<string, unknown>}
          nodeOpacity={0.95}
          nodeResolution={14}
          linkColor={(() => 'rgba(246, 193, 144, 0.35)') as unknown as Record<string, unknown>}
          linkOpacity={0.5}
          linkWidth={0.6}
          enableNodeDrag={true}
          enableNavigationControls={true}
          enablePointerInteraction={true}
          warmupTicks={150}
          cooldownTicks={Infinity}
          d3AlphaDecay={0.022}
          d3VelocityDecay={0.4}
          onNodeClick={handleNodeClick as unknown as Record<string, unknown>}
        />
      ) : null}

      {/* Search bar replaces the old stats line. Typing a customer id, a type
        name like "customer" or "account", or "segment N" surfaces matches
        ranked by exact-id-match then degree. Enter or click flies the camera
        to the chosen node. */}
      <div className="absolute top-3 left-3 z-10 w-[min(440px,calc(100%-1.5rem))]">
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => window.setTimeout(() => setShowResults(false), 150)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults[0]) {
                e.preventDefault()
                handleSearchSelect(searchResults[0])
              } else if (e.key === 'Escape') {
                setShowResults(false)
                e.currentTarget.blur()
              }
            }}
            placeholder="Search customer id, type (organization / account / customer), or segment"
            aria-label="Search the customer graph"
            className="w-full rounded-[var(--radius-sm)] border border-[#3a2a1c] bg-[#1a1410]/90 px-3 py-2 font-mono text-[12px] text-[#e7c693] placeholder:text-[#5f4632] focus:border-[#f3c969] focus:outline-none"
          />
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full right-0 left-0 mt-1 overflow-hidden rounded-[var(--radius-sm)] border border-[#3a2a1c] bg-[#1a1410]/96 shadow-lg backdrop-blur">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((n) => {
                    const color = GROUP_COLORS_HEX[n.group] ?? GROUP_COLORS_HEX[0]!
                    return (
                      <li
                        key={n.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSearchSelect(n)
                        }}
                        className="flex cursor-pointer items-center gap-2 px-3 py-1.5 font-mono text-[11px] text-[#c9a978] hover:bg-[#231711] hover:text-[#f3c969]"
                      >
                        <span
                          aria-hidden
                          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                          className="inline-block h-2 w-2 shrink-0 rounded-full"
                        />
                        <span className="text-[#f3c969]">
                          {businessLabel(n.type)} #{n.id}
                        </span>
                        <span className="text-[#5f4632]">·</span>
                        <span>{n.degree} connections</span>
                        <span className="text-[#5f4632]">·</span>
                        <span>segment {n.group}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="px-3 py-2 font-mono text-[11px] text-[#9c7c5a]">
                  No matches for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compact help text at the bottom. */}
      <div className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] font-mono text-[10px] text-[#9c7c5a]">
        hover for details · click a node to fly in · drag a node to pull it · drag empty space to
        orbit · scroll to zoom
      </div>
    </div>
  )
}
