import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const BG = '#2b251f'
const FG = '#f4ece0'
const FG_MUTED = '#b9ad99'
const ACCENT = '#5ad0e6'

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
          flexDirection: 'row',
          background: BG,
          color: FG,
          fontFamily: 'sans-serif',
          padding: '72px 88px',
        }}
      >
        <div
          style={{
            width: 4,
            background: ACCENT,
            alignSelf: 'stretch',
            marginRight: 56,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: ACCENT,
              margin: 0,
            }}
          >
            {eyebrow}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h1
              style={{
                fontSize: title.length > 28 ? 72 : 88,
                fontWeight: 600,
                letterSpacing: -2,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: 36, color: FG_MUTED, margin: 0 }}>{subtitle}</p>
          </div>
          <p style={{ fontSize: 22, color: FG_MUTED, margin: 0, fontFamily: 'monospace' }}>
            pratikpatil.dev
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
