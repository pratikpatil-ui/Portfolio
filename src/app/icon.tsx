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
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 6,
          letterSpacing: '-1px',
        }}
      >
        <span style={{ color: '#0F172A' }}>P</span>
        <span style={{ color: '#F2B647' }}>P</span>
      </div>
    ),
    size,
  )
}
