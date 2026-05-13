import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: -1.4,
          color: '#5FCCBA',
          lineHeight: 1,
        }}
      >
        PP
      </div>
    ),
    size,
  )
}
