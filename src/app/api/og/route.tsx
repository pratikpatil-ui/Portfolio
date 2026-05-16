import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Palette pulled from the live site's design tokens so the OG image reads as
// the same product, not a separate marketing collateral.
const BG = '#14110d'
const FG = '#f5e3c4'
const FG_MUTED = '#a78962'
const FG_SUBTLE = '#7a5d3c'
const ACCENT = '#f3c969'
const ORANGE = '#ff8a3d'
const CORAL = '#e8584c'

// Deterministic seeded RNG so every render produces the same constellation
// and the OG image is cache-stable.
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

type StarNode = { x: number; y: number; r: number; color: string; hub: boolean }
type StarEdge = { a: number; b: number }

function buildConstellation(seed: number, width: number, height: number) {
  const rng = mulberry32(seed)
  const PALETTE = [ACCENT, ORANGE, CORAL]
  const nodes: StarNode[] = []

  // Sparse background twinkles across the whole canvas. No edges, low alpha,
  // purely texture so the warm-dark background does not read as flat.
  const TWINKLE_N = 22
  for (let i = 0; i < TWINKLE_N; i++) {
    const x = 30 + rng() * (width - 60)
    const y = 30 + rng() * (height - 60)
    const r = 0.9 + rng() * 1.4
    const color = PALETTE[Math.floor(rng() * PALETTE.length)] ?? ACCENT
    nodes.push({ x, y, r, color, hub: false })
  }

  // Hero star anchors the right column, placed slightly above center so it
  // balances the headline mass on the left.
  nodes.push({ x: 1010, y: 270, r: 10, color: ORANGE, hub: true })

  // Constellation nodes confined to the right ~40% so the left side stays as
  // a clean text column.
  const RIGHT_N = 34
  const HUBS_TARGET = 6
  for (let i = 0; i < RIGHT_N; i++) {
    const x = 720 + rng() * 440
    const y = 50 + rng() * 530
    const hub = i < HUBS_TARGET
    const r = hub ? 3.5 + rng() * 2.5 : 1.2 + rng() * 2.2
    const color = PALETTE[Math.floor(rng() * PALETTE.length)] ?? ACCENT
    nodes.push({ x, y, r, color, hub })
  }

  const edges: StarEdge[] = []
  const hubs = nodes
    .map((n, i) => ({ n, i }))
    .filter((entry) => entry.n.hub)

  // Each non-hub connects to its nearest hub. Density tuned so the right side
  // reads as a real force layout, not a starfield sprinkle.
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]!.hub) continue
    let bestHubIdx = hubs[0]!.i
    let bestDist = Infinity
    for (const { n: h, i: hi } of hubs) {
      const dx = nodes[i]!.x - h.x
      const dy = nodes[i]!.y - h.y
      const d2 = dx * dx + dy * dy
      if (d2 < bestDist) {
        bestDist = d2
        bestHubIdx = hi
      }
    }
    if (rng() < 0.75) edges.push({ a: i, b: bestHubIdx })
  }

  // Hub-to-hub bridges so the topology has bones, not just spokes.
  for (let i = 0; i < hubs.length - 1; i++) {
    if (rng() < 0.6) edges.push({ a: hubs[i]!.i, b: hubs[i + 1]!.i })
  }
  // Also link every hub back to the hero star so it reads as the center.
  for (let i = 1; i < hubs.length; i++) {
    if (rng() < 0.7) edges.push({ a: hubs[0]!.i, b: hubs[i]!.i })
  }

  return { nodes, edges }
}

const DEFAULT_TITLE = 'I build AI product surfaces that pass bank compliance review.'
const DEFAULT_EYEBROW = 'Senior Software Engineer'
const DEFAULT_BULLETS = [
  'AI product UIs in banking',
  '10K-node customer graphs at 60fps',
  '28-module React 18 migrations in 7 days',
]

export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eyebrow = searchParams.get('eyebrow') || DEFAULT_EYEBROW
  const titleRaw = searchParams.get('title')
  const isHome = !titleRaw
  const title = titleRaw || DEFAULT_TITLE
  const minutes = searchParams.get('minutes')
  const subtitleParam = searchParams.get('subtitle')

  // Bullets only appear on the home OG. Inner pages get a single subtitle.
  const bullets = isHome ? DEFAULT_BULLETS : null
  const subtitle = subtitleParam || (minutes ? `${minutes} min read` : null)

  // Constellation seed is stable. Could be derived from the slug for per-page
  // variation, but a single signature constellation reads as brand.
  const { nodes, edges } = buildConstellation(13, 1200, 630)

  // Title sizing: tuned so the home positioning statement fits comfortably
  // in the 700px-wide left column, but case-study titles still feel big.
  const titleSize = title.length > 50 ? 60 : title.length > 30 ? 72 : 86

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: BG,
          color: FG,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Warm radial glow behind the hero star on the right, pulling the
            eye into the constellation. */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: -120,
            width: 760,
            height: 540,
            background:
              'radial-gradient(ellipse at center, rgba(255,138,61,0.24) 0%, rgba(243,201,105,0.10) 35%, rgba(20,17,13,0) 75%)',
            display: 'flex',
          }}
        />

        {/* Constellation backdrop. */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {edges.map((e, i) => {
            const a = nodes[e.a]!
            const b = nodes[e.b]!
            return (
              <line
                key={`e${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={ACCENT}
                strokeWidth={0.6}
                opacity={0.22}
              />
            )
          })}
          {nodes.map((n, i) =>
            n.hub ? (
              <g key={`h${i}`}>
                {/* Three concentric halos approximate a soft glow without
                    relying on SVG filters, which Satori does not render. */}
                <circle cx={n.x} cy={n.y} r={n.r * 5} fill={n.color} opacity={0.06} />
                <circle cx={n.x} cy={n.y} r={n.r * 3} fill={n.color} opacity={0.12} />
                <circle cx={n.x} cy={n.y} r={n.r * 1.8} fill={n.color} opacity={0.28} />
                <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.95} />
              </g>
            ) : (
              <circle
                key={`n${i}`}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.color}
                opacity={0.6}
              />
            ),
          )}
        </svg>

        {/* Foreground content. */}
        <div
          style={{
            position: 'relative',
            padding: '60px 72px',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Top row: eyebrow on the left, PP cursor mark on the right. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <p
              style={{
                fontSize: 18,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: ACCENT,
                margin: 0,
                fontFamily: 'monospace',
              }}
            >
              {eyebrow}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: 42,
                letterSpacing: -3,
                color: FG,
              }}
            >
              <span>PP</span>
              <span
                style={{
                  width: 14,
                  height: 14,
                  background: ACCENT,
                  marginBottom: 7,
                  boxShadow: `0 0 22px ${ACCENT}`,
                }}
              />
            </div>
          </div>

          {/* Headline + supporting copy. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <h1
              style={{
                fontSize: titleSize,
                fontWeight: 600,
                letterSpacing: -2.5,
                lineHeight: 1.02,
                margin: 0,
                maxWidth: 720,
                color: FG,
              }}
            >
              {title}
            </h1>

            {bullets ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {bullets.map((b) => (
                  <div
                    key={b}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      fontSize: 28,
                      color: FG_MUTED,
                      fontFamily: 'monospace',
                    }}
                  >
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 99,
                        background: ACCENT,
                        boxShadow: `0 0 14px ${ACCENT}`,
                      }}
                    />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ) : subtitle ? (
              <p
                style={{
                  fontSize: subtitle.length > 70 ? 24 : subtitle.length > 40 ? 28 : 32,
                  color: FG_MUTED,
                  margin: 0,
                  maxWidth: 700,
                  lineHeight: 1.35,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          {/* Bottom row: URL on the left, location on the right. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${FG_SUBTLE}33`,
              paddingTop: 24,
            }}
          >
            <p
              style={{
                fontSize: 20,
                color: FG_MUTED,
                margin: 0,
                fontFamily: 'monospace',
                letterSpacing: -0.5,
              }}
            >
              pratikpatil.dev
            </p>
            <p
              style={{
                fontSize: 18,
                color: FG_SUBTLE,
                margin: 0,
                fontFamily: 'monospace',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Jersey City · Open to NYC
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // One day fresh at the edge, one week stale-while-revalidate. Slow
        // social crawlers (LinkedIn, Slack) get instant cached responses
        // instead of paying the ~1.8s cold-start every fetch, which is what
        // was causing LinkedIn to time out and cache "no preview".
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  )
}
