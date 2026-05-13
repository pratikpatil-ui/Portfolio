import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const BG = '#0F172A'
const FG = '#F9FAFB'
const FG_MUTED = '#A0AEC0'
const SAGE = '#5FCCBA'
const GOLD = '#F2B647'

export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eyebrow = searchParams.get('eyebrow') || 'Senior Software Engineer'
  const title = searchParams.get('title') || 'Pratik Patil'
  const minutes = searchParams.get('minutes')
  const subtitle = minutes
    ? `${minutes} min read`
    : 'Jersey City, NJ. Open to NYC and US relocation.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          color: FG,
          padding: 72,
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* PP mark with cursor, top-left corner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: 48,
            letterSpacing: -3,
            lineHeight: 1,
            color: FG,
          }}
        >
          <span>PP</span>
          <span
            style={{
              width: 12,
              height: 12,
              background: GOLD,
              marginBottom: 6,
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <p
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: SAGE,
              margin: 0,
            }}
          >
            {eyebrow}
          </p>
          <h1
            style={{
              fontSize: title.length > 28 ? 76 : 96,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 32, color: FG_MUTED, margin: 0 }}>{subtitle}</p>
        </div>

        <p
          style={{
            fontSize: 22,
            color: FG_MUTED,
            margin: 0,
            fontFamily: 'monospace',
          }}
        >
          pratikpatil.dev
        </p>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
