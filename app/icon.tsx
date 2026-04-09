import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

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
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4C8572 0%, #F2B647 100%)',
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.5px',
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
