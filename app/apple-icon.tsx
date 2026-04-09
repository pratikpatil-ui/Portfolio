import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

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
          borderRadius: '20%',
          background: 'linear-gradient(135deg, #4C8572 0%, #F2B647 100%)',
        }}
      >
        <span
          style={{
            fontSize: 90,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-2px',
          }}
        >
          PP
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
