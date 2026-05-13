export type Post = {
  slug: string
  title: string
  summary: string
  date: string
  readingTime: number
  tags: string[]
  body: string
}

const reactMigration = `Seven days is short for a 28-module migration. Here is how we did it without breaking the platform.

## The setup

A 28-module React 17 codebase, 4.1MB initial bundle, Time to Interactive of 7.2 seconds in Lighthouse. Sales calls were ending before the demo loaded. The platform team had three months on the roadmap to "fix performance." Sales had three months of new prospects, of which two months would be gone before the platform team finished planning. We bet the work could land in seven calendar days.

This is the day-by-day playbook of what we did, what we cut, and what we shipped.

## What we did not change

Before anything else, we listed what we would not touch. Material UI stayed. Redux Toolkit stayed. The auth flow stayed. The 28 features stayed feature-complete and behaviorally identical. The diff had to be small enough that a senior reviewer could read it and convince themselves nothing broke.

Anything outside that list got cut, even good ideas. The hardest part of the seven days was telling teammates "we are not refactoring that today" eight or nine times.

## Day 1: profiling and the bet

Built a clean Lighthouse run as the baseline. TTI 7.2s, FCP 2.1s, initial bundle 4.1MB. The bundle analyzer told the story: every module was loaded eagerly, every icon library was bundled, the date-fns import pulled in the whole library, Material UI imports went through the top-level barrel.

The bet:
- Switch to React Router v6 with route-level React.lazy and Suspense.
- Replace the top-level barrel imports with named imports.
- Introduce a single navigationConfig that drives the sidebar and the router from one list.
- Skip memoization, skip context refactors, skip every "while we're here" idea.

If those four changes did not move the number, we would stop and replan.

## Day 2: navigationConfig and feature modules

Wrote a navigationConfig with one entry per module, each one a lazy import. The sidebar started reading from the config. The router started reading from the config. The two stopped drifting.

We also locked feature module surfaces: each module exposes one default export and an optional secondary entry. Nothing else is importable from outside the module. Locked imports made the code-split boundaries match the module boundaries, which gave us clean chunks instead of webpack inventing them.

## Day 3: React Router v6 and route-level Suspense

Swapped React Router v5 for v6. The new createBrowserRouter API turned out to be the cleanest path. Each route uses React.lazy on the module entry. Suspense at the route level shows a skeleton loader until the chunk arrives.

First Lighthouse re-run: TTI 4.1s, initial bundle 1.8MB. The biggest single win came from the lazy boundary, not from any micro-optimization.

## Day 4: imports and icons

Hunted down barrel imports. The Material UI barrel was the worst offender: a single import of @mui/material/* pulled 1.5MB of components we did not use. Replaced every import with named subpaths (@mui/material/Button instead of @mui/material). That alone took 400KB off the bundle.

Replaced the icon library with a tree-shakable per-icon import. That was another 220KB.

Replaced date-fns with three named functions actually used in the app. Another 80KB.

## Day 5: profiling the second-paint

TTI was down to 2.4s, but the post-FCP frames were still janky. Used the React Profiler to find the worst offenders. A single component with a 600-row table was rendering on every input keystroke because of a parent re-render. One memo fix dropped it to a stable 60fps. That was the only memoization we did the whole week.

This was a deliberate choice. Aggressive memo would have locked invariants we wanted free to change later. Profile-first kept us honest.

## Day 6: regression sweep

Spent a full day clicking through every module on three browsers. Found four bugs: a broken modal close button, a stale icon in one section, a missing keyboard shortcut, and a CSS regression on a dropdown that was using a deprecated import path.

Fixed all four. None were caused by the migration; they were preexisting bugs that the regression sweep made visible. We kept them in the same PR. Future-us will thank current-us for catching them.

## Day 7: Lighthouse, audit, and ship

Final Lighthouse run: TTI 2.0s, FCP 1.1s, initial bundle 1.55MB. Sent the audit report to the sales team. Tagged the release. Shipped.

## What it actually shipped

- Time to Interactive: 7.2s to 2.0s, verified in Lighthouse.
- Initial bundle: 4.1MB to 1.55MB.
- Zero regressions in the first month after release.
- Sidebar reorganized from 3 sections to 6 hubs in the same release because the new config made it trivial.
- Per-route lazy chunks meant each module loaded in under 400ms on a cold cache.

## What I would do differently

I would add a Lighthouse budget to CI from day one. We caught regressions by hand for a month before the budget landed. A budget would have caught a 200KB regression that snuck in two weeks after launch.

I would enforce the locked-import rule with ESLint, not the README. The README rule survived two months before someone bypassed it and pulled a feature module into another feature module.

## The thing I keep coming back to

The migration worked because of what we did not do, not because of what we did. Boring decisions (React Router v6, React.lazy, named imports) beat exotic ones (custom code-splitting, hand-rolled router, build-time tree-shaking plugins) every time. The exotic version of this migration takes three months. The boring version took seven days.

If you are looking at a platform you suspect is slow because of structure rather than features, profile first, write the list of changes you will not make, and then change as little as possible. The wins are out there. You do not have to rewrite anything to find them.`

const d3Graph = `Rendering 10K nodes at 60fps in a regulated banking SaaS, with the force simulation in a Web Worker, the rendering on canvas, hit detection without a quadtree, and zoom and pan that does not feel like Google Maps. Here is what survived contact with production.

## The job

Marketing teams managed customer cohorts as CSVs. The relationship graph behind those cohorts was visible to the backend and nobody else. Product wanted a visual surface where marketing could see the network and pick outbound targets by their position in it.

The constraints: 10K live nodes at 60fps on a MacBook Air. Data in S3, streamed on demand. Zoom, pan, click, drag a node. Runs inside the React 18 platform shell, which we had just migrated.

## SVG was off the table

SVG breaks past 5K nodes from DOM cost alone. Every node is a DOM element, every animation triggers a layout. At 10K nodes the browser spends more time reconciling than drawing. We measured. It was bad.

I tried it anyway because it was easier. The first prototype ran at 8fps on a clean machine. That ended the SVG conversation.

## Canvas, then

Canvas is one element. Drawing is procedural. The browser does not reconcile a tree. The cost is linear in the number of nodes you draw. At 10K nodes the draw loop takes ~5ms per frame on the canvas alone, which left us 11ms for everything else inside a 16ms budget.

The downsides are real. Canvas has no built-in interaction. You build your own hit detection. You build your own zoom. You build your own selection state.

We chose canvas because the linear cost gave us a clear headroom story and the interaction code we had to write was a one-time investment.

## Force in a Web Worker

The first useful trick is moving the force simulation off the main thread.

d3-force runs a simulation: each tick, it computes new positions for every node based on forces (charge, link, center, collide). With 10K nodes, a single tick takes 2-3ms on a fast machine and 8-10ms on a slow one. If the simulation runs on the main thread, it competes with React for the same 16ms budget. Result: dropped frames whenever React decides to render.

Move the simulation to a Web Worker and the main thread only paints. Position updates arrive via postMessage as a Float32Array (one number per coordinate, transferable buffer for zero-copy). The main thread reads the buffer and draws.

The buffer transfer pattern matters. If you postMessage an array of objects, the structured-clone cost dominates for large graphs. A Float32Array transferred via transferable buffers takes microseconds.

## Hit detection without a quadtree

The textbook answer for "find which node is under the cursor" with 10K nodes is a quadtree. The textbook is right for some workloads. For this one, a naive linear scan turned out to be fine.

The reasoning: we only need hit detection on pointer events, which happen tens of times per second, not every frame. A linear scan of 10K nodes takes ~1ms. The quadtree would have shaved that to ~0.05ms at the cost of a tree rebuild on every simulation tick.

Quadtrees are correct when you have many hit tests per frame (collision detection between thousands of moving objects). For a UI graph with one cursor and one hit test per pointer event, linear is fine and the code is simpler.

If the graph ever moves to 100K nodes, the quadtree comes back. Today it does not.

## Zoom and pan with d3-zoom

d3-zoom handles the math. You bind it to the canvas, it produces a transform matrix (translate x, translate y, scale), and you apply the transform inside your draw loop. The draw becomes:

\`\`\`ts
ctx.setTransform(dpr, 0, 0, dpr, 0, 0)  // reset for device pixel ratio
ctx.clearRect(0, 0, width, height)
ctx.translate(transform.x, transform.y)
ctx.scale(transform.k, transform.k)
// draw nodes and edges in world coordinates
\`\`\`

The trick is to set the device-pixel-ratio scale only once per frame and then apply the user transform on top. If you mix them, your line widths and font sizes lie to you.

## Visual decisions

Node radius scales with degree. We used the square root of degree because a linear ramp made hubs visually overwhelming. The sqrt curve is more legible at the extremes.

Color ramps by degree, in OKLCH. OKLCH stays perceptually constant across lightness, which matters because the same segment color must read the same on a 2px peripheral node and a 16px hub. RGB ramps shift hue, and the user notices: "wait, are those the same segment?"

Edges are drawn before nodes, with low alpha and a thin line width that scales inversely with zoom. At wide zoom the edges fade into a haze. At close zoom they sharpen up. This is on purpose: at wide zoom you should see the topology, at close zoom you should see the relationships.

## The IntersectionObserver pause

If the user scrolls past the graph, the simulation should not keep ticking. We wrapped the canvas in an IntersectionObserver. When the graph leaves the viewport, the simulation pauses. When it re-enters, it resumes. Same for tab visibility: the document.visibilitychange event pauses on hide.

This sounds obvious but it took us a week to wire because the first version paused the draw loop but kept the simulation running. The simulation kept burning CPU off-screen.

## Touch and reduced motion

On touch devices we reduce the node count automatically (default drops to 500). Force simulations at 10K on a mid-range phone are not worth it; the topology is the point, not the count.

For users with prefers-reduced-motion, we run the simulation once, draw the final positions, and stop. They get the graph, they do not get the animation. This is a usability win and a CPU win.

## What 100K would need

If we doubled the count, the simulation cost would go quadratic (force is O(n^2) without spatial acceleration). d3-force has a Barnes-Hut approximation for charge that brings it back to O(n log n). For 100K we would turn that on.

We would also move to WebGL. Canvas can draw 100K small circles in 16ms; that is the upper bound. WebGL ships the geometry to the GPU once and reuses it forever. The maintenance cost goes up: you write shaders, you handle context loss, you debug GPU memory. At 10K that is overkill. At 100K it pays for itself.

We would also add level-of-detail rendering: hide labels below a zoom threshold, hide edges below a degree threshold, draw only nodes in the viewport. These tricks compound.

## What I would do differently

Add a WebGL fallback path with a feature flag, not a fork. We hit a customer with a 25K-node graph two months after launch. The canvas version held up at 30fps, which was acceptable but not great. WebGL behind a flag would have been ready.

Pre-bake the LOD strategy from day one, even if we turn it off. The hooks for hide-at-zoom and hide-by-degree are easy to add early and painful to retrofit.

## The thing I keep coming back to

10K nodes at 60fps is not a hardware achievement. It is a series of correct boring choices: canvas instead of SVG, worker instead of main thread, transferable buffers instead of cloned objects, linear scan instead of premature quadtree, OKLCH instead of RGB. None of those are clever. Each one is the obvious answer to a question someone has already answered.

The clever part is being willing to skip the clever parts.`

const llmPrimitives = `Building three LLM chat surfaces for the same company taught me which patterns reused and which did not. Here are the ten I would build again.

## Why primitives matter

Each surface had a slightly different ask: an analyst chat, a customer-support assistant, an internal eval tool. The temptation is to fork the first one and customize. The cost shows up six months later when a bug in the SSE handler has been ported three times and fixed twice.

Primitives meant: build once, parametrize, share. The primitives were boring on purpose. The interesting code lives in the surfaces.

## 1. SSE event contract

Server-Sent Events with a typed event contract. Four event types: status, partial, complete, error. Status is for "thinking" and "searching" affordances. Partial is the text delta. Complete signals end-of-message. Error closes the stream with a code and message the client can branch on.

Why SSE and not WebSockets: SSE is one-way, browsers reconnect automatically, and the protocol maps cleanly to a token stream. WebSockets are bidirectional and pay a complexity cost we did not need.

Why a contract: without one, every surface invented its own JSON shape and the renderer code grew per-surface branches. With one, the renderer is the same everywhere.

## 2. Streaming renderer

The component that turns a stream of partials into rendered output. It is a state machine: idle, streaming, done, error. It handles auto-scroll on new content with a "pause auto-scroll when the user scrolled up" rule. It renders a soft blinking cursor at the end of the latest message while streaming.

It does not parse markdown. It hands off to a markdown renderer that runs on the accumulated text. Doing it incrementally is tempting and a trap: markdown is order-dependent, and you can render the wrong tree when a closing tag has not arrived.

## 3. Structured output blocks

LLMs are happy to mix prose and structured data. The renderer treats both as first-class. The model emits typed blocks (table, card, chart, code, text). Each block is a React component. The chat looks conversational; the data inside it stays typed.

The hard part is the contract between model and renderer. We used JSON Schema to describe block types and validated incoming blocks against it. Invalid blocks fall back to a plain text render with a warning, not a crash.

## 4. Embedded BI

For chart blocks, we embed Apache Superset via signed iframe. The model picks the chart, the renderer drops the iframe, and the user sees the same chart they would see in Superset directly. Compliance had already audited Superset; we did not have to re-fight that battle.

The trick is the signed URL. The frontend never sees the chart URL directly. The backend signs a one-time URL with the user's permissions baked in, and the iframe loads that.

## 5. Cancel

Every stream has a cancel button. The button calls abort on the fetch's AbortController, which closes the connection client-side. The server sees the close and stops generating. The UI shows the partial response as final, marked "stopped."

Cancel mid-stream is the most important LLM UI feature people skip. Without it, an analyst who realized the model is going down the wrong path has to wait for the full response. With it, they cut their losses and reframe.

## 6. Retry

A "retry" button on assistant messages that re-runs the request with the same input. Useful when the model produces a bad answer (and the user wants a different sample) or when the SSE stream errored partway through.

Retry preserves the conversation history up to the user message and re-runs from there. The bad assistant message is replaced. If the user wants the old answer back, undo brings it back.

## 7. Error recovery

Errors arrive over the wire as typed events. The renderer maps each error code to a recovery UI:

- network errors get a "retry" affordance
- rate-limit errors get a "you have hit the daily limit" message with a fallback contact
- model errors get a "the model failed to respond, here is what it sent so far" with a retry
- tool-use errors get an inline message and let the conversation continue

The point is that errors do not crash the conversation. They become ghost messages with their own action affordances.

## 8. Conversation memory

The chat carries the last N messages back to the server on every request. We capped N at 20 to keep the input size predictable. For longer conversations the server summarizes older turns and sends the summary plus the recent N.

The memory primitive is just an array of role/content pairs. The complexity is in deciding when to summarize, which model to use for the summary, and how to render the "summarized" affordance to the user (we used a collapsible "Earlier in this conversation" block).

## 9. Follow-up suggestions

After every assistant message, we render three suggested follow-ups. The model emits them as a structured block. They are not magic; they are the model's best guesses at what the user might ask next given the conversation so far.

The hit rate was higher than we expected. Analysts who used follow-ups asked more questions per session, which is the metric product cared about. We did not add this for that reason; we added it because it felt right. The metric is a happy side effect.

## 10. Export

A conversation has an Export action that downloads the conversation as Markdown. The model emits clean prose; the markdown export is just the rendered tree without the chat chrome.

Export matters because analysts wanted to paste findings into Slack and Notion. Without it they took screenshots. Screenshots are unsearchable. Markdown is.

## The eleventh: telemetry

Bake telemetry into the SSE contract from day one. Time to first token, total stream duration, errors per session, cancels per session, retries per session. We added it later and lost a week reconstructing the missing month.

Telemetry is the difference between "I think the model is slow" and "the p95 time to first token rose 40% last Tuesday after the model swap." Build it in early.

## What I would do differently

The structured-output renderer was a forking risk. The first surface emitted slightly different block shapes from the second one because we let each team customize the schema. Force a single schema and version it. Versioning meant a block consumer could declare which version it understood and the renderer could fall back gracefully on mismatches.

Build an internal eval harness before launch, not after compliance asks for one. Without an eval harness, every change to the prompt or model is gut-feel. With one, you can A/B prompts on a fixed test set and watch the win rate.

## The thing I keep coming back to

LLM chat UI feels like a new field. It is mostly old fields wearing a hat. SSE has been around for a decade. Streaming UI patterns are older than that. The new part is the latency profile (long-running streams with cancellable mid-flight requests) and the structured-output rendering. Everything else is just careful state management with a model in the loop.

If you are building one of these, start with the primitives. The surface is the easy part. The primitives are what survive.`

export const posts: Post[] = [
  {
    slug: 'react-18-migration-playbook',
    title: 'A React 18 migration playbook',
    summary:
      'How we cut Time to Interactive from 7.2s to 2s in a 7-day sprint on a 28-module platform. The day-by-day record.',
    date: '2026-04-15',
    readingTime: 10,
    tags: ['React', 'Performance', 'Platform'],
    body: reactMigration,
  },
  {
    slug: 'd3-at-10k-nodes',
    title: 'D3 at 10K nodes',
    summary:
      'Canvas over SVG, force in a Web Worker, hit detection without a quadtree, and what 100K would need.',
    date: '2026-05-01',
    readingTime: 12,
    tags: ['D3', 'Data Viz', 'Performance'],
    body: d3Graph,
  },
  {
    slug: 'llm-chat-ui-primitives',
    title: 'LLM chat UI primitives',
    summary:
      'Ten patterns I rebuilt across three internal chat surfaces. SSE contracts, structured output, retry, cancel, embedded BI.',
    date: '2026-05-08',
    readingTime: 14,
    tags: ['AI', 'LLM', 'UI', 'React'],
    body: llmPrimitives,
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getPostSlugs(): string[] {
  return posts.map((p) => p.slug)
}

export const ALL_POST_TAGS: string[] = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
