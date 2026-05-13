import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const runtime = 'edge'

// Solid background uses var(--color-bg) dark-theme hex: hsl(222 47% 11%) ≈ #0F172A.
const BG = '#0F172A'
const FG = '#F9FAFB'
const CURSOR = '#F2B647'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BG,
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 110,
          letterSpacing: -7,
          color: FG,
          lineHeight: 1,
          position: 'relative',
        }}
      >
        <span>PP</span>
        <span
          style={{
            position: 'absolute',
            right: 32,
            bottom: 42,
            width: 20,
            height: 20,
            background: CURSOR,
          }}
        />
      </div>
    ),
    size,
  )
}
