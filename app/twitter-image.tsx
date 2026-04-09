import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Pratik Patil - Software Engineer | Frontend Specialist'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(76, 133, 114, 0.1)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #4C8572 0%, #5FCCBA 100%)',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              fontFamily: 'system-ui',
            }}
          >
            PP
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#F9FAFB',
            marginBottom: '12px',
            fontFamily: 'system-ui',
          }}
        >
          Pratik Patil
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '28px',
            color: '#4C8572',
            marginBottom: '24px',
            fontFamily: 'system-ui',
            fontWeight: '500',
          }}
        >
          Software Engineer | Frontend Specialist
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '18px',
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '800px',
            fontFamily: 'system-ui',
          }}
        >
          Building real-time, data-heavy interfaces for enterprise clients
        </div>

        {/* Tech badges */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px',
          }}
        >
          {['React', 'TypeScript', 'Next.js', 'D3.js'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 20px',
                background: 'rgba(76, 133, 114, 0.15)',
                borderRadius: '999px',
                color: '#5FCCBA',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'system-ui',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
