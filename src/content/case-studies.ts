export type Decision = { chose: string; considered: string; why: string }

export type CaseStudy = {
  slug: string
  eyebrow: string
  title: string
  oneLine: string
  clientFraming: string
  role: string
  timeline: string
  teamSize: string
  stack: string[]
  tags: string[]
  featured?: boolean
  liveUrl?: string
  repoUrl?: string
  problem: string[]
  constraints: string[]
  decisions: Decision[]
  codeSample?: { language: string; filename?: string; code: string }
  liveDemo?: 'force-graph'
  outcomes: string[]
  retro: string[]
  next: string
}

const sseHook = `import { useEffect, useRef, useState } from 'react'

type Event =
  | { type: 'status'; status: 'thinking' | 'searching' | 'ready' }
  | { type: 'partial'; text: string }
  | { type: 'complete'; messageId: string }
  | { type: 'error'; code: string; message: string }

export function useSSEStream(url: string, body: unknown) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  function cancel() {
    abortRef.current?.abort()
    setStatus('idle')
  }

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('streaming')
    setText('')

    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.body) throw new Error('No response body')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\\n\\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const evt = JSON.parse(line.slice(6)) as Event
            if (evt.type === 'partial') setText((t) => t + evt.text)
            else if (evt.type === 'error') {
              setError(evt.message)
              setStatus('error')
            }
          }
        }
        setStatus('done')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [url, body])

  return { text, status, error, cancel }
}`

const forceWorker = `import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
} from 'd3-force'

type Node = { id: string; x: number; y: number; vx: number; vy: number; degree: number }
type Link = { source: string; target: string }

let simulation: ReturnType<typeof forceSimulation<Node, Link>> | null = null
let nodes: Node[] = []

self.onmessage = (event: MessageEvent) => {
  const msg = event.data
  if (msg.type === 'init') {
    nodes = msg.nodes
    simulation = forceSimulation<Node, Link>(nodes)
      .force('charge', forceManyBody().strength(-30))
      .force('link', forceLink<Node, Link>(msg.links).id((n) => n.id).distance(20))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide<Node>().radius((n) => 2 + Math.sqrt(n.degree)))
      .stop()

    // Pre-compute layout off the main thread.
    for (let i = 0; i < 200; i++) simulation.tick()
    postPositions()
  }
  if (msg.type === 'tick') {
    if (!simulation) return
    simulation.tick()
    postPositions()
  }
  if (msg.type === 'drag') {
    const node = nodes.find((n) => n.id === msg.id)
    if (node) {
      node.fx = msg.x
      node.fy = msg.y
      simulation?.alphaTarget(0.3).restart()
    }
  }
  if (msg.type === 'release') {
    const node = nodes.find((n) => n.id === msg.id)
    if (node) {
      node.fx = undefined
      node.fy = undefined
      simulation?.alphaTarget(0)
    }
  }
}

function postPositions() {
  const buf = new Float32Array(nodes.length * 2)
  for (let i = 0; i < nodes.length; i++) {
    buf[i * 2] = nodes[i].x
    buf[i * 2 + 1] = nodes[i].y
  }
  ;(self as unknown as Worker).postMessage(buf, [buf.buffer])
}`

const navigationConfig = `import type { ComponentType } from 'react'
import { lazy } from 'react'

type ModuleId =
  | 'audiences'
  | 'campaigns'
  | 'consent'
  | 'analytics'
  | 'chatcdp'
  // ... 23 more

type ModuleConfig = {
  id: ModuleId
  label: string
  section: 'identity' | 'engagement' | 'analytics' | 'ai' | 'admin'
  icon: ComponentType
  component: ComponentType
  permissions: string[]
}

export const navigationConfig: ModuleConfig[] = [
  {
    id: 'audiences',
    label: 'Audiences',
    section: 'identity',
    icon: lazy(() => import('@/icons/audiences')),
    component: lazy(() => import('@/modules/audiences')),
    permissions: ['audiences:read'],
  },
  {
    id: 'chatcdp',
    label: 'ChatCDP',
    section: 'ai',
    icon: lazy(() => import('@/icons/chatcdp')),
    component: lazy(() => import('@/modules/chatcdp')),
    permissions: ['chatcdp:read'],
  },
  // 26 more modules, each one lazy-loaded.
]

// Sidebar + router both derive from this list.
// Sidebar groups by \`section\`. Router uses \`id\` as path segment.
// Permissions are enforced at the boundary, not inside the module.`

const offlineQueue = `import type { Middleware } from '@reduxjs/toolkit'

type QueuedAction = {
  id: string
  action: { type: string; payload?: unknown }
  ts: number
}

const STORAGE_KEY = 'modenx:queue'

function load(): QueuedAction[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}
function save(q: QueuedAction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(q))
}

export const offlineQueueMiddleware: Middleware = (store) => (next) => (action) => {
  const a = action as { type: string; meta?: { offline?: boolean }; payload?: unknown }
  const isWrite = a.type.endsWith('/post') || a.type.endsWith('/put')
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true

  if (isWrite && !online) {
    const queued: QueuedAction = {
      id: crypto.randomUUID(),
      action: { type: a.type, payload: a.payload },
      ts: Date.now(),
    }
    const next = [...load(), queued]
    save(next)
    return next
  }
  return next(a)
}

// On 'online' event, replay queued actions in order, drop on 4xx,
// retry with backoff on 5xx. UI shows a small "syncing" pill.
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    const queue = load()
    save([])
    for (const item of queue) {
      // replay through the store, swallow errors per item
    }
  })
}`

export const caseStudies: CaseStudy[] = [
  {
    slug: 'chatcdp',
    eyebrow: 'AI Product UI',
    title: 'ChatCDP',
    oneLine: 'An LLM chat surface that brokerage analysts trust enough to use daily.',
    clientFraming: 'Tier-1 retail brokerage',
    role: 'Sole frontend architect',
    timeline: '4 months',
    teamSize: '1 FE, 2 BE, 1 PM',
    stack: [
      'React 18',
      'Redux Toolkit',
      'TypeScript',
      'SSE',
      'Apache Superset',
      'Tailwind',
      'Node.js',
      'Vercel AI SDK',
    ],
    tags: ['AI/LLM', 'Fintech'],
    featured: true,
    problem: [
      'Brokerage analysts spent hours pulling cohorts from a customer data platform, writing repetitive SQL, and clicking through dashboards to answer the same questions every week. Product wanted a chat surface that let them ask in plain English and get answers backed by real data, not hallucinated text.',
      'Compliance review meant the chat had to do three things at the same time: no fabrication, traceable numbers, and recoverable errors. We had to design streaming responses, structured-output rendering, embedded BI when the answer naturally maps to a chart, and a recovery path for every failure mode that hits during the trading day.',
      'The bar was "a tool a senior analyst would not be embarrassed to use in front of a managing director." I owned the full frontend architecture: the SSE event contract, the structured output renderer, the Superset embedding pattern, and the primitives library used by three internal chat surfaces.',
    ],
    constraints: [
      'Banking compliance review of every UI surface.',
      'No silent fabrication. Every claim cites a query result.',
      'Sub-second time-to-first-token.',
      'Apache Superset embedded inline, not in a separate tab.',
      'Strict structured-output rendering. Cards, tables, charts as first-class blocks.',
      'Errors recover, they do not crash the conversation.',
      'Design system enforced.',
    ],
    decisions: [
      {
        chose: 'Server-Sent Events with a typed event contract (status, partial, complete, error)',
        considered: 'Raw WebSockets, polling, plain JSON responses',
        why: 'SSE is one-way, reconnects automatically, and maps cleanly to LLM token streams. WebSockets added complexity for nothing. Polling felt wrong at the latency we wanted.',
      },
      {
        chose: 'Structured output blocks rendered as native React components inside the stream',
        considered: 'Always-text responses or always-JSON responses',
        why: 'Real analyst workflows mix prose and tables. Forcing one shape made the surface feel either chatty or robotic. Letting the model emit typed blocks gave us a rich surface without losing conversational flow.',
      },
      {
        chose: 'Apache Superset embedded via signed iframe',
        considered: 'Re-rendering charts client-side from raw query results',
        why: 'Superset already had the queries, access control, and audit trail compliance had blessed. Rebuilding that on the client would have re-fought every audit conversation.',
      },
      {
        chose: 'Reusable primitives library (streaming renderer, retry, cancel, error recovery, memory)',
        considered: 'Ad-hoc components per surface',
        why: 'Three internal teams wanted variants of the same chat. Building primitives once meant the second and third surfaces shipped in weeks, not months.',
      },
    ],
    codeSample: {
      language: 'tsx',
      filename: 'hooks/useSSEStream.ts',
      code: sseHook,
    },
    outcomes: [
      'SSE contract shipped with average time-to-first-token of 420ms.',
      'Analysts adopted within the first month, replacing a manual SQL workflow.',
      'Embedded Superset eliminated tab-switching to look up the cited chart.',
      'Structured output removed the manual parsing step analysts used to do by hand.',
      'Primitives library reused across three internal chat surfaces.',
    ],
    retro: [
      'Bake telemetry into the SSE contract from day one. We added it later and lost a week.',
      'Push for an internal eval harness before launch, not after compliance asks for one.',
    ],
    next: 'onedata-plus',
  },

  {
    slug: 'onedata-plus',
    eyebrow: 'Data Visualization',
    title: 'OneDATA.Plus',
    oneLine:
      'A 10K-node customer network graph that marketing teams actually use to pick outbound targets.',
    clientFraming: 'Enterprise SaaS for banking compliance',
    role: 'Sole frontend architect',
    timeline: '18 months overall, 6 weeks for the graph',
    teamSize: '1 FE, 3 BE, 1 designer, 1 PM',
    stack: [
      'React 18',
      'D3.js v7',
      'Canvas',
      'Web Workers',
      'S3',
      'TypeScript',
      'Material UI',
      'Redux Toolkit',
    ],
    tags: ['Data viz', 'Fintech'],
    featured: true,
    liveDemo: 'force-graph',
    problem: [
      'Marketing teams pulled customer cohorts as CSVs and the signal was buried in row counts. The relationship graph that drives outbound targeting was locked in backend tables, invisible to the people who needed it most.',
      'We built a network graph as the primary visual surface: a star-field universe view, node size by degree, color by segment. The technical problem was rendering 10K live nodes against a real-time backend. SVG breaks past 5K nodes. We needed canvas, the force simulation moved off the main thread, and a virtualized fetch pattern that streamed nodes from S3 on demand.',
    ],
    constraints: [
      '10K nodes at 60fps on a MacBook Air.',
      'Data lives in S3, fetched on demand.',
      'Zoom, pan, and node click required.',
      'Runs inside the React 18 platform shell.',
    ],
    decisions: [
      {
        chose: 'Canvas',
        considered: 'SVG, WebGL',
        why: 'SVG breaks past 5K nodes from DOM cost alone. WebGL was overkill at 10K and would have doubled the maintenance surface. Canvas hit 60fps with one frame budget to spare.',
      },
      {
        chose: 'Force simulation in a Web Worker',
        considered: 'Main-thread force, pre-computed positions',
        why: 'Main-thread force blocks React on every tick. A worker posts position arrays back via transferable buffers, so the main thread only paints.',
      },
      {
        chose: 'On-demand virtualized fetch from S3',
        considered: 'Preload all customers',
        why: 'Preloading hundreds of MB up front killed time-to-first-frame. Streaming what the viewport needs kept the first paint fast.',
      },
      {
        chose: 'Degree-driven node radius and OKLCH color ramp',
        considered: 'Linear RGB ramp by segment',
        why: 'RGB ramps shift hue across lightness. OKLCH keeps hue perceptually constant, so a tiny node and a hub node read as the same segment.',
      },
    ],
    codeSample: {
      language: 'ts',
      filename: 'components/graph/force-simulation.worker.ts',
      code: forceWorker,
    },
    outcomes: [
      '60fps on an M1 MacBook Air, 45fps on an iPhone 13.',
      'Time to first frame under 800ms with virtualized fetch.',
      'Marketing surfaced highest-degree customers as priority outbound targets.',
      'Graph component reused for three downstream surfaces.',
    ],
    retro: [
      'Add a WebGL fallback for 50K+ nodes. We hit the canvas ceiling sooner than expected.',
      'Pre-bake level-of-detail strategy: hide labels at low zoom, hide edges below a degree threshold.',
    ],
    next: 'react-18-migration',
  },

  {
    slug: 'react-18-migration',
    eyebrow: 'Platform Engineering',
    title: 'React 18 migration',
    oneLine:
      'A seven-day sprint that cut platform Time to Interactive from 7.2 seconds to 2.',
    clientFraming: 'Internal platform migration',
    role: 'Migration lead',
    timeline: '7 days',
    teamSize: '2 frontend engineers',
    stack: ['React 18', 'React Router v6', 'TypeScript', 'Webpack', 'Lighthouse'],
    tags: ['Performance', 'Platform'],
    problem: [
      '28 modules running on React 17, a 4.1MB initial bundle, and a Time to Interactive of 7.2 seconds. Sales calls were ending before the demo finished loading.',
      'I scoped the work to seven calendar days. The bet was that we could ship a feature-module structure with locked surfaces, a config-driven router, route-level React.lazy, and no actual feature changes. The hardest part was resisting the urge to refactor anything that did not directly enable the perf win.',
    ],
    constraints: [
      '7 calendar days, fixed.',
      'Zero regressions.',
      'Material UI enforced.',
      'Lighthouse must verifiably improve.',
    ],
    decisions: [
      {
        chose: 'Feature modules with locked public surfaces',
        considered: 'Flat src/ tree or a DDD rewrite',
        why: 'Flat trees age badly. A DDD rewrite would have blown the deadline by months. Feature modules with locked imports gave us the cleanup wins without rewriting the platform.',
      },
      {
        chose: 'Single navigationConfig drives sidebar and routing',
        considered: 'Hardcoded sidebar plus a separate route table',
        why: 'Two sources of truth always drift. One config kept the sidebar, routes, permissions, and code-splitting in sync forever.',
      },
      {
        chose: 'React Router v6 with React.lazy and Suspense per route',
        considered: 'Router v5 plus manual dynamic imports',
        why: 'v6 made the lazy pattern declarative. Manual imports meant 28 hand-written code-splits, each one a chance to bundle the wrong module.',
      },
      {
        chose: 'memo only where profiling showed a need',
        considered: 'Aggressive memoization across every component',
        why: 'Aggressive memo locks the wrong invariants and slows real renders. Profile-first kept us honest.',
      },
    ],
    codeSample: {
      language: 'ts',
      filename: 'navigationConfig.ts',
      code: navigationConfig,
    },
    outcomes: [
      'Shipped on day 7, zero regressions in the first month.',
      'Time to Interactive 7.2s to 2s, verified in Lighthouse.',
      'Initial bundle size reduced 62%.',
      'Sidebar reorganized from 3 sections to 6 hubs in the same release.',
    ],
    retro: [
      'Add a Lighthouse budget to CI from day one. We caught regressions by hand for a month.',
      'Enforce the locked-import rule with ESLint, not the README.',
    ],
    next: 'modenx',
  },

  {
    slug: 'modenx',
    eyebrow: 'Mobile',
    title: 'ModenX',
    oneLine:
      'A React Native retail app shipped to both stores in three months with no prior mobile experience.',
    clientFraming: 'US retail',
    role: 'Mobile lead',
    timeline: '3 months',
    teamSize: '5 engineers',
    stack: [
      'React Native',
      'TypeScript',
      'Redux Toolkit',
      'React Navigation',
      'Firebase',
      'Push Notifications',
      'Deep Linking',
    ],
    tags: ['Mobile'],
    featured: true,
    problem: [
      'A US retail client needed a mobile app for in-store use, with two distinct user types: retailer staff and shoppers. Building two apps doubled maintenance cost. Building one app with two surfaces would ship slower if the architecture was wrong.',
      'I had no prior React Native experience. Inside the 3-month deadline I had to learn the stack, own the architecture, coordinate a 5-engineer team, and ship to both App Store and Google Play on first or second submission.',
    ],
    constraints: [
      '3 months, fixed.',
      'Single codebase, two surfaces, no fork.',
      'Offline-first for spotty in-store WiFi.',
      'App Store and Play approval on first or second submission.',
      'Four of five engineers also new to React Native.',
    ],
    decisions: [
      {
        chose: 'Single app with a role switch and a shared Redux store',
        considered: 'Two apps in a monorepo',
        why: 'Two apps double the release cycle, the analytics surface, and the bug-report routing. One app with a role-aware navigator kept the shared 80% shared and the diverging 20% explicit.',
      },
      {
        chose: 'Offline-first with a queued-action middleware that replays on reconnect',
        considered: 'Online-required with a "no connection" screen',
        why: 'Retail WiFi is bad enough that an online-only app meant blocked checkout. Queued writes meant the experience kept working and synced when the network came back.',
      },
      {
        chose: 'Mobile coding conventions written down on day three',
        considered: 'Ad hoc style per engineer',
        why: 'Four engineers new to React Native plus me. A short handbook eliminated 80% of the review nitpicks before week two.',
      },
    ],
    codeSample: {
      language: 'ts',
      filename: 'store/offlineQueueMiddleware.ts',
      code: offlineQueue,
    },
    outcomes: [
      'Shipped to both stores in 3 months.',
      '100+ Play downloads in the first weeks, with positive review skew.',
      'Mobile handbook adopted as the team standard.',
      'The 5-engineer team was independent on the mobile codebase by the end of the first month.',
    ],
    retro: [
      'Invest in Detox or Maestro E2E earlier. We caught real regressions in manual QA that automation would have flagged.',
      'Push for a TestFlight cadence from week two, not week eight.',
    ],
    next: 'amex-workflow',
  },

  {
    slug: 'amex-workflow',
    eyebrow: 'Compliance UI',
    title: 'Compliance Workflows',
    oneLine:
      'A React Flow surface that surfaced in-flight customer-data workflows for an Amex compliance ops team.',
    clientFraming: 'Fortune 100 banking client',
    role: 'Frontend lead',
    timeline: '4 months',
    teamSize: '1 FE, 2 BE, 1 PM',
    stack: ['React', 'React Flow', 'TypeScript', 'REST', 'GraphQL', 'RBAC', 'Audit logging'],
    tags: ['Compliance', 'Fintech'],
    problem: [
      'A compliance ops team managed hundreds of in-flight workflows across customer onboarding and data review. The existing tool was a spreadsheet. Owners were not visible at a glance, stage transitions were not auditable, and the team was missing SLAs because the surface did not show the right state at the right time.',
      'We built a React Flow tool that visualized each workflow as a node graph with owners, transitions, and live status. Backend events streamed in. Drag-and-drop reordering, zoom and pan on dense graphs, and inline audit trails on every node. RBAC kept the wrong people from advancing the wrong tasks.',
    ],
    constraints: [
      'Compliance review of every UI surface.',
      'Audit trail is a hard requirement, not a nice-to-have.',
      'Real-time streaming updates of workflow state.',
      'Dense graphs (50 to 200 nodes) must stay readable.',
      'RBAC enforced at the surface, not just at the API.',
    ],
    decisions: [
      {
        chose: 'React Flow',
        considered: 'A custom DAG renderer',
        why: 'Drag, zoom, and pan worked out of the box. Custom DAG meant rebuilding those primitives and re-fighting them on every edge case.',
      },
      {
        chose: 'Inline audit trail on every node',
        considered: 'A side panel that opens on selection',
        why: 'Reviewers asked for audit context at the point of decision, not one click away. Inline made the right action obvious.',
      },
      {
        chose: 'RBAC at node level',
        considered: 'API-only enforcement',
        why: 'Showing a node a user cannot advance feels broken. Hiding or disabling at the surface matched the actual mental model.',
      },
    ],
    outcomes: [
      'Ops leads managed three to four times more workflows per shift than the spreadsheet baseline (client-reported).',
      'Audit integration approved on first compliance review.',
      'React Flow chosen as the standard for two follow-on surfaces in the same product line.',
    ],
    retro: ['Add a snapshot test of the audit trail rendering. Manual QA caught a copy regression I should have caught earlier.'],
    next: 'citizens-marketplace',
  },

  {
    slug: 'citizens-marketplace',
    eyebrow: 'Marketplace UI',
    title: 'Marketplace UI',
    oneLine:
      'A full marketplace surface delivered end to end in 3 months under a critical client deadline.',
    clientFraming: 'Fortune 100 banking client',
    role: 'Frontend lead',
    timeline: '3 months',
    teamSize: '1 FE, 2 BE, 1 designer, 1 PM',
    stack: ['React', 'TypeScript', 'Material UI', 'Multi-tenant theming', 'Self-hosted logging'],
    tags: ['Fintech'],
    problem: [
      'The client needed a marketplace UI for a new product line, with a non-negotiable 3-month deadline. Marketing announcements were booked. Multi-tenant theming was required so each tenant could be reskinned without a code release.',
      'I owned the surface from architecture to launch: a responsive listing, filtering, search, detail flows, pagination, skeleton loaders, permission-gated views, and multi-tenant theming on top so the same React tree could render with different brand tokens. Self-hosted logging because the SaaS vendor was blocked by compliance.',
    ],
    constraints: [
      '3 months, fixed.',
      'Multi-tenant theming without runtime code changes per tenant.',
      'Self-hosted logging only.',
      'Material UI as the base component library.',
    ],
    decisions: [
      {
        chose: 'Multi-tenant theming via runtime token swap',
        considered: 'Build-time variants per tenant',
        why: 'Build-time variants multiply the CI matrix and the regression surface. Runtime tokens kept one deployment, one CI, one set of tests.',
      },
      {
        chose: 'Self-hosted error and audit logging with React Error Boundaries',
        considered: 'Sentry or LogRocket',
        why: 'Compliance blocked SaaS observability. The self-hosted approach met the audit bar and ran on the same infra as everything else.',
      },
      {
        chose: 'Skeleton loaders',
        considered: 'Indeterminate spinners',
        why: 'Perceived performance is real performance. Skeletons made the page feel two seconds faster on the same backend.',
      },
    ],
    outcomes: [
      'Shipped on day 90.',
      'Multi-tenant theming reused for two follow-on surfaces.',
      'Self-hosted logging became the template for compliance-blocked use cases across the product line.',
    ],
    retro: ['Add visual regression testing from week one. The token swap broke layout in one tenant and the bug landed in production.'],
    next: 'afficiency',
  },

  {
    slug: 'afficiency',
    eyebrow: 'Insurance UI',
    title: 'Config-driven insurance UI',
    oneLine:
      'A configuration-driven UI that adjusts forms, validations, and disclosures from regulatory documents, not code releases.',
    clientFraming: 'US health insurance product, California launch',
    role: 'Frontend lead',
    timeline: '2.5 months',
    teamSize: '1 FE, 1 BE, 1 PM',
    stack: ['React', 'TypeScript', 'JSON Schema', 'Dynamic form rendering', 'Validation'],
    tags: ['Insurance'],
    problem: [
      'The insurance product team was rolling out in California. Regulations differ per state and the existing product had state-specific logic hardcoded. Every new state took an engineering release and a regression cycle.',
      'I built a configuration-driven UI layer where forms, validations, eligibility rules, and disclosure copy all render from a JSON schema authored by product and compliance from the regulatory documents themselves. Adding a new state became a config commit and a copy review, not a code release.',
    ],
    constraints: [
      'California regulations met exactly.',
      'Future state launches ship without re-touching the React tree.',
      'Disclosure copy reviewable in a non-code format.',
    ],
    decisions: [
      {
        chose: 'JSON Schema as source of truth',
        considered: 'TypeScript-typed config or a custom DSL',
        why: 'JSON Schema is reviewable by non-engineers and has tooling. A custom DSL would have been a new dialect to teach compliance.',
      },
      {
        chose: 'Render forms dynamically from the schema',
        considered: 'Per-state templates with overrides',
        why: 'Templates drift. One schema renderer kept the surface consistent and made compliance review tractable.',
      },
      {
        chose: 'Disclosure copy in the schema, not i18n files',
        considered: 'Standard i18n pipeline',
        why: 'Disclosures are not translations. Living in the schema kept compliance review a single document, not two.',
      },
    ],
    outcomes: [
      'California rollout shipped on time.',
      'Subsequent state expansions ship as config-only commits.',
      'Compliance review cycle cut from weeks to days.',
    ],
    retro: ['Build a config preview tool earlier so non-engineers can iterate without pulling a dev.'],
    next: 'chai-edition',
  },

  {
    slug: 'chai-edition',
    eyebrow: 'Solo Project (AI-Assisted)',
    title: 'Chai Edition',
    oneLine:
      'A cinematic digital magazine that turns Indian chai culture into a scroll-driven editorial experience.',
    clientFraming: 'Solo project',
    role: 'Solo — concept, direction, build, ship',
    timeline: 'Side project',
    teamSize: '1',
    stack: [
      'React',
      'Vite',
      'TypeScript',
      'Framer Motion',
      'CSS Modules',
      'AI Visuals',
      'GitHub',
      'Vercel',
    ],
    tags: ['Side project', 'AI-Assisted', 'Creative Engineering'],
    featured: true,
    liveUrl: 'https://chai-edition.vercel.app',
    repoUrl: '#',
    problem: [
      'I wanted to see how far I could push a portfolio-grade web experience by treating an AI coding assistant like a junior pair, not a magic box. The premise: take something I personally care about — Indian chai culture — and turn it into a scroll-driven cinematic magazine. Every section reads like an edition. A fixed background chai video carries the mood while typography and motion do the storytelling.',
      'The harder problem was ownership. AI-assisted code is only as good as the product direction behind it. I owned the concept, the naming, the editorial structure, the prompts, the design language, the QA, the GitHub workflow, and the Vercel deployment. Claude Code wrote and debugged the React + TypeScript implementation; GPT helped with content shaping and positioning. The point was to ship something that reads like a deliberate product, not a vibe-coded demo.',
    ],
    constraints: [
      'One person, evenings only.',
      'Premium Indian luxury visual identity — readable, not garish.',
      'Scroll-driven storytelling without jank on mid-range mobile.',
      'AI-generated visuals integrated cleanly, not pasted on top.',
      'Static, free hosting on Vercel.',
    ],
    decisions: [
      {
        chose: 'Vite + React + TypeScript with CSS Modules',
        considered: 'Next.js App Router or Astro',
        why: 'No SSR or routing needs. A single editorial scroll surface ships faster on Vite, with TypeScript strict on the components and CSS Modules to keep section styles scoped.',
      },
      {
        chose: 'Framer Motion for scroll-driven section transitions',
        considered: 'Hand-rolled IntersectionObserver and CSS keyframes',
        why: 'Framer Motion viewport hooks and variants let me prototype editorial motion in minutes. Re-implementing the same primitives by hand would have eaten the project time budget for no creative gain.',
      },
      {
        chose: 'AI-generated stills and short video as production assets, human-owned prompts',
        considered: 'Stock photography or commissioned illustration',
        why: 'A solo evening budget cannot pay for chai photography that matches a cinematic editorial look. AI assets, prompted and selected by me, hit the visual bar without compromising the concept.',
      },
      {
        chose: 'A Colophon section that names the AI workflow and human ownership explicitly',
        considered: 'Saying nothing about the build process',
        why: 'Hiding the workflow would have undersold the product direction. The Colophon is interview-ready: this is what I owned, this is what AI tools did, this is the seam.',
      },
    ],
    outcomes: [
      'Shipped live on Vercel with a fixed video background and scroll-driven editorial sections.',
      'Edition-style structure: cinematic hero, product cards for chai blends, Colophon close.',
      'Mobile layout holds up — sections breathe, video is throttled appropriately, no horizontal scroll.',
      'Project doubles as a working answer to "how do you use AI tools as a senior engineer."',
    ],
    retro: [
      'Move the video to an adaptive HLS source. The current MP4 is fine on desktop but heavier than I want on 4G.',
      'Publish the GitHub repo with a license so the build is fully inspectable, not just the live site.',
    ],
    next: 'bio-maker',
  },

  {
    slug: 'bio-maker',
    eyebrow: 'Solo Project (Live)',
    title: 'Bio Maker',
    oneLine:
      'A marriage biodata generator for Indian families and NRI diaspora. Live, freemium, my own product.',
    clientFraming: 'Consumer SaaS, solo founder',
    role: 'Solo',
    timeline: '200 hours over evenings and weekends',
    teamSize: '1',
    stack: [
      'Next.js 15',
      'TypeScript',
      'Tailwind v4',
      'shadcn/ui',
      'jsPDF',
      'html2canvas',
      'Razorpay',
      'Vercel',
      'PostHog',
    ],
    tags: ['Consumer SaaS', 'Side project'],
    liveUrl: 'https://bio-maker-in.vercel.app',
    problem: [
      'Indian families build biodata in Word or Photoshop. Most are ugly, inconsistent, and a pain to update. NRI families have the same problem plus the added friction of unfamiliar tools. There was no clean web-first biodata maker with mobile-first responsive forms and client-side PDF export.',
      'I built Bio Maker as a freemium consumer SaaS, mobile-first, sub-2s cold load on Indian 4G, with client-side PDF generation via jsPDF and html2canvas so the export never leaves the device. Razorpay handles the one-time premium upgrade.',
    ],
    constraints: [
      'Solo build, evenings and weekends.',
      'Mobile-first, sub-2s cold load on 4G.',
      'PDF must render exactly what the user sees.',
      'Freemium, product-led growth, no SaaS subscription.',
    ],
    decisions: [
      {
        chose: 'Next.js 15 App Router on Vercel',
        considered: 'Astro, Remix, Vite SPA',
        why: 'SSR for SEO, streaming for fast first paint, and React Server Components for the static marketing pages. Vercel kept the deploy story trivial.',
      },
      {
        chose: 'Client-side PDF generation',
        considered: 'Server-side Puppeteer',
        why: 'Keeping data on the device sidestepped privacy questions and kept the Vercel bill at zero. The tradeoff is layout fidelity, which I solved with a fixed-size print template.',
      },
      {
        chose: 'One-time premium',
        considered: 'Monthly subscription',
        why: 'Marriage biodata is a one-time use case. A subscription would have churned in a week.',
      },
    ],
    outcomes: [
      'Live, sub-2s cold load on mobile, measured in PostHog.',
      'Freemium funnel measured end to end.',
      'Solo end to end, including marketing site and payment integration.',
    ],
    retro: [
      'Add server-side PDF as a premium option for richer layouts.',
      'Build custom analytics views in PostHog instead of relying on default dashboards.',
    ],
    next: 'tulsee',
  },

  {
    slug: 'tulsee',
    eyebrow: 'Solo Project (Open Source)',
    title: 'TULSEE',
    oneLine:
      'A real-time work management and collaboration platform with E2E-encrypted group chat.',
    clientFraming: 'B2C product, solo build',
    role: 'Solo',
    timeline: 'Side project, evenings',
    teamSize: '1',
    stack: [
      'React',
      'Redux',
      'Next.js',
      'Chakra UI',
      'Node.js',
      'Express',
      'Firebase',
      'Socket.IO',
      'Zoom API',
    ],
    tags: ['Real-time', 'Side project', 'Open source'],
    repoUrl: 'https://github.com/pratikpatil-ui/work-management-collab-tool',
    problem: [
      'I wanted to build real-time work management to learn the harder parts of collaborative software: task CRUD with archive, full-text search, real-time updates, E2E-encrypted group chat, a Zoom integration, and Google SSO.',
      'The point was the building, not the product market. Open source playground for socket.io patterns, E2E encryption with Web Crypto, and the harder corners of real-time state sync.',
    ],
    constraints: [
      'Side project time budget.',
      'Real-time everything.',
      'E2E encryption that does not feel like a research project.',
    ],
    decisions: [
      {
        chose: 'Socket.IO',
        considered: 'Raw WebSockets',
        why: 'Reconnection, rooms, ack/nack out of the box. Raw WebSockets meant reinventing the connection lifecycle for a side project.',
      },
      {
        chose: 'Web Crypto for E2E group chat',
        considered: 'A third-party SDK',
        why: 'The point was learning. Web Crypto kept the dependency surface small and the encryption logic visible.',
      },
      {
        chose: 'Firebase for auth and persistence',
        considered: 'Custom Node plus Postgres',
        why: 'Firebase got the boring parts out of the way so I could spend time on the parts I wanted to learn.',
      },
    ],
    outcomes: [
      'Real-time tasks, full-text search, archive.',
      'E2E-encrypted group chat with Web Crypto.',
      'Zoom integration for instant call creation.',
      'Open source, public repo.',
    ],
    retro: [
      'Build E2E against an actual threat model. Mine was implicit and a real attacker model would have shaped key rotation differently.',
      'Replace Firebase with Postgres plus Auth.js if I continue the project.',
    ],
    next: 'chatcdp',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

export function getCaseStudySlugs(): string[] {
  return caseStudies.map((c) => c.slug)
}

export const ALL_TAGS: string[] = Array.from(
  new Set(caseStudies.flatMap((c) => c.tags)),
).sort()
