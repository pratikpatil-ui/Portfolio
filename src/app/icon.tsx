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
          background: 'linear-gradient(135deg, #5FCCBA 0%, #3A6B5B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0F172A',
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 7,
          letterSpacing: '-1px',
          position: 'relative',
        }}
      >
        <span style={{ color: '#0F172A', lineHeight: 1 }}>P</span>
        <span
          style={{
            position: 'absolute',
            right: 5,
            bottom: 5,
            width: 4,
            height: 4,
            borderRadius: 4,
            background: '#F2B647',
          }}
        />
      </div>
    ),
    size,
  )
}
