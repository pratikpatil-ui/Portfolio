/// <reference lib="webworker" />
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'

type Node = SimulationNodeDatum & { id: number; degree: number }
type Link = SimulationLinkDatum<Node>

let sim: Simulation<Node, Link> | null = null
let nodes: Node[] = []

type InitMsg = { type: 'init'; nodes: Node[]; links: Link[]; ticks?: number }
type TickMsg = { type: 'tick' }
type DragMsg = { type: 'drag'; id: number; x: number; y: number }
type ReleaseMsg = { type: 'release'; id: number }
type Msg = InitMsg | TickMsg | DragMsg | ReleaseMsg

const w = self as unknown as DedicatedWorkerGlobalScope

w.onmessage = (e: MessageEvent<Msg>) => {
  const msg = e.data
  if (msg.type === 'init') {
    nodes = msg.nodes
    sim = forceSimulation<Node, Link>(nodes)
      .force('charge', forceManyBody<Node>().strength(-22))
      .force(
        'link',
        forceLink<Node, Link>(msg.links)
          .id((n) => n.id)
          .distance(18)
          .strength(0.4),
      )
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide<Node>().radius((n) => 2 + Math.sqrt(n.degree)))
      .alpha(1)
      .stop()

    const pre = msg.ticks ?? 200
    for (let i = 0; i < pre; i++) sim.tick()
    postPositions()
  } else if (msg.type === 'tick') {
    if (!sim) return
    sim.tick()
    postPositions()
  } else if (msg.type === 'drag') {
    const n = nodes[msg.id]
    if (n) {
      n.fx = msg.x
      n.fy = msg.y
      sim?.alphaTarget(0.3).restart()
    }
  } else if (msg.type === 'release') {
    const n = nodes[msg.id]
    if (n) {
      n.fx = null
      n.fy = null
      sim?.alphaTarget(0)
    }
  }
}

function postPositions() {
  const buf = new Float32Array(nodes.length * 2)
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    if (!n) continue
    buf[i * 2] = n.x ?? 0
    buf[i * 2 + 1] = n.y ?? 0
  }
  w.postMessage(buf, [buf.buffer])
}
