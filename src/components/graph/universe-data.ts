// Seeded synthetic universe of 1K entities across three entity types
// and ten connected clusters (groups). Groups bias the edge generator so
// connected subgraphs sit together once the force layout settles, which is
// what makes the rendered scene read as a galaxy of differently-colored
// clusters instead of a uniform blob.

export type EntityType = 0 | 1 | 2 // 0 organization, 1 account, 2 person

export const GROUP_COUNT = 10 as const

// Ten visually distinct hues for the clusters. Tableau-balanced palette so
// every segment reads clearly against the warm-dark background.
export const GROUP_COLORS_HEX: ReadonlyArray<string> = [
  '#4e79a7', // blue
  '#f28e2c', // orange
  '#e15759', // red
  '#76b7b2', // teal
  '#59a14f', // green
  '#edc949', // yellow
  '#af7aa1', // purple
  '#ff9da7', // pink
  '#9c755f', // brown
  '#bab0ab', // gray
]

export const GROUP_COLORS_RGB: ReadonlyArray<readonly [number, number, number]> = [
  [243, 201, 105],
  [255, 138, 61],
  [232, 88, 76],
  [244, 162, 97],
  [231, 111, 81],
  [214, 132, 69],
  [196, 117, 71],
  [233, 177, 106],
  [184, 92, 56],
  [240, 147, 108],
]

export type UniverseDataset = {
  n: number
  m: number
  type: Uint8Array
  group: Uint8Array
  degree: Int32Array
  linkSource: Int32Array
  linkTarget: Int32Array
  adjOffsets: Int32Array
  adjNeighbors: Int32Array
  maxDegree: number
  hubThreshold: number
  topHubs: Int32Array
}

function mulberry32(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateUniverse(
  nodeCount: number,
  linkCount: number,
  seed = 42,
): UniverseDataset {
  const rng = mulberry32(seed)
  const n = nodeCount
  const type = new Uint8Array(n)
  const group = new Uint8Array(n)

  // Assign groups uniformly across all nodes.
  for (let i = 0; i < n; i++) {
    group[i] = i < GROUP_COUNT ? i : Math.floor(rng() * GROUP_COUNT)
    const r = rng()
    type[i] = r < 0.07 ? 0 : r < 0.27 ? 1 : 2
  }

  const sources: number[] = []
  const targets: number[] = []
  const deg = new Int32Array(n)

  function bumpDeg(i: number) {
    deg[i] = (deg[i] ?? 0) + 1
  }

  // Per-group anchor triangle. Each group gets a small seed clique of 3
  // mutually connected nodes, so each cluster has a hub to grow from.
  const anchorBase = Math.min(GROUP_COUNT * 3, n)
  for (let g = 0; g < GROUP_COUNT && g * 3 + 2 < n; g++) {
    const a = g * 3
    const b = g * 3 + 1
    const c = g * 3 + 2
    group[a] = g
    group[b] = g
    group[c] = g
    sources.push(a, a, b)
    targets.push(b, c, c)
    bumpDeg(a)
    bumpDeg(b)
    bumpDeg(a)
    bumpDeg(c)
    bumpDeg(b)
    bumpDeg(c)
  }

  // Preferential attachment weighted by degree, biased to prefer same-group
  // targets. Same-group bias is the lever that produces visually distinct
  // clusters once the force layout settles.
  const SAME_GROUP_BIAS = 0.85

  function pickPreferentialSameGroup(upto: number, targetGroup: number, attempts: number): number {
    let bestId = -1
    let bestW = 0
    for (let k = 0; k < attempts; k++) {
      const cand = Math.floor(rng() * upto)
      if (group[cand] !== targetGroup) continue
      const w = (deg[cand] ?? 0) + 1
      if (w > bestW) {
        bestId = cand
        bestW = w
      }
    }
    return bestId
  }

  function pickPreferential(upto: number, attempts: number): number {
    let bestId = Math.floor(rng() * upto)
    let bestW = (deg[bestId] ?? 0) + 1
    for (let k = 0; k < attempts; k++) {
      const cand = Math.floor(rng() * upto)
      const w = (deg[cand] ?? 0) + 1
      if (w > bestW) {
        bestId = cand
        bestW = w
      }
    }
    return bestId
  }

  for (let i = anchorBase; i < n; i++) {
    const edges = rng() < 0.25 ? 3 : 2
    const used = new Set<number>()
    for (let e = 0; e < edges; e++) {
      let target = -1
      if (rng() < SAME_GROUP_BIAS) {
        target = pickPreferentialSameGroup(i, group[i] ?? 0, 18)
      }
      if (target < 0) target = pickPreferential(i, 6)
      let guard = 0
      while ((used.has(target) || target === i) && guard < 8) {
        target = pickPreferential(i, 6)
        guard++
      }
      if (used.has(target) || target === i) continue
      used.add(target)
      sources.push(i)
      targets.push(target)
      bumpDeg(i)
      bumpDeg(target)
    }
  }

  // Top up with random cross-group edges to lift overall edge count.
  // These act as the "bridges" between clusters.
  const hardCap = Math.min(linkCount, n * 6)
  let guard = 0
  while (sources.length < hardCap && guard < hardCap * 3) {
    guard++
    const a = Math.floor(rng() * n)
    const b = Math.floor(rng() * n)
    if (a === b) continue
    sources.push(a)
    targets.push(b)
    bumpDeg(a)
    bumpDeg(b)
  }

  const m = sources.length
  const linkSource = Int32Array.from(sources)
  const linkTarget = Int32Array.from(targets)

  // CSR adjacency for fast neighborhood iteration.
  const adjOffsets = new Int32Array(n + 1)
  for (let i = 0; i < m; i++) {
    const s = linkSource[i] ?? 0
    const t = linkTarget[i] ?? 0
    adjOffsets[s + 1] = (adjOffsets[s + 1] ?? 0) + 1
    adjOffsets[t + 1] = (adjOffsets[t + 1] ?? 0) + 1
  }
  for (let i = 1; i <= n; i++) {
    adjOffsets[i] = (adjOffsets[i] ?? 0) + (adjOffsets[i - 1] ?? 0)
  }
  const fill = new Int32Array(n)
  const adjNeighbors = new Int32Array(adjOffsets[n] ?? 0)
  for (let i = 0; i < m; i++) {
    const s = linkSource[i] ?? 0
    const t = linkTarget[i] ?? 0
    const sOff = (adjOffsets[s] ?? 0) + (fill[s] ?? 0)
    adjNeighbors[sOff] = t
    fill[s] = (fill[s] ?? 0) + 1
    const tOff = (adjOffsets[t] ?? 0) + (fill[t] ?? 0)
    adjNeighbors[tOff] = s
    fill[t] = (fill[t] ?? 0) + 1
  }

  let maxDegree = 0
  for (let i = 0; i < n; i++) {
    const d = deg[i] ?? 0
    if (d > maxDegree) maxDegree = d
  }

  // Top-N hubs by degree for the glow pass.
  const topCount = Math.min(40, n)
  const indices = new Int32Array(n)
  for (let i = 0; i < n; i++) indices[i] = i
  const top: number[] = []
  for (let pick = 0; pick < topCount; pick++) {
    let bestIdx = pick
    let bestDeg = deg[indices[pick] ?? 0] ?? 0
    for (let i = pick + 1; i < n; i++) {
      const d = deg[indices[i] ?? 0] ?? 0
      if (d > bestDeg) {
        bestIdx = i
        bestDeg = d
      }
    }
    const tmp = indices[pick] ?? 0
    indices[pick] = indices[bestIdx] ?? 0
    indices[bestIdx] = tmp
    top.push(indices[pick] ?? 0)
  }
  const topHubs = Int32Array.from(top)

  const fiftiethIdx = Math.min(topCount - 1, top.length - 1)
  const fiftiethNode = top[fiftiethIdx] ?? top[0] ?? 0
  const fiftiethDeg = deg[fiftiethNode] ?? 1
  const hubThreshold = Math.max(6, Math.min(Math.floor(maxDegree * 0.4), fiftiethDeg))

  return {
    n,
    m,
    type,
    group,
    degree: deg,
    linkSource,
    linkTarget,
    adjOffsets,
    adjNeighbors,
    maxDegree,
    hubThreshold,
    topHubs,
  }
}

export function neighborsOf(dataset: UniverseDataset, id: number): Int32Array {
  const start = dataset.adjOffsets[id] ?? 0
  const end = dataset.adjOffsets[id + 1] ?? start
  return dataset.adjNeighbors.subarray(start, end)
}

export function entityLabel(t: number): string {
  return t === 0 ? 'org' : t === 1 ? 'account' : 'person'
}
