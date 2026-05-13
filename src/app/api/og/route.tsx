import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const BG = '#2b251f'
const FG = '#f4ece0'
const FG_MUTED = '#b9ad99'
const ACCENT = '#5ad0e6'

export function GET() {
  return new ImageResponse(
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
          width: 2,
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: FG_MUTED,
              margin: 0,
            }}
          >
            Senior Software Engineer
          </p>
          <p
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: ACCENT,
              margin: 0,
            }}
          >
            AI Product UI
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h1
            style={{
              fontSize: 124,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              margin: 0,
            }}
          >
            Pratik Patil
          </h1>
          <p style={{ fontSize: 28, color: FG_MUTED, margin: 0 }}>
            Jersey City, NJ. Open to NYC and US relocation.
          </p>
        </div>
        <p style={{ fontSize: 22, color: FG_MUTED, margin: 0 }}>pratikpatil.dev</p>
      </div>
    </div>,
    { width: 1200, height: 630 },
  )
}
