import { ImageResponse } from 'next/og'
import { hero, site } from '@/content/site'

export const alt = `${site.name} — ${hero.headline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'radial-gradient(circle at 82% 40%, rgba(255, 79, 24,0.35), rgba(6,6,6,0) 45%), #0E0E0E',
          color: '#F3F1EC',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 128 128" fill="none">
            <circle cx="64" cy="64" r="38" stroke="#FF4F18" strokeWidth="8" />
            <circle cx="64" cy="64" r="14" fill="#F3F1EC" />
            <path d="M24 72C40 45 78 32 106 44" stroke="#F3F1EC" strokeWidth="7" strokeLinecap="round" />
            <circle cx="104" cy="44" r="8" fill="#FF4F18" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{site.name}</span>
            <span style={{ fontSize: 16, letterSpacing: 4, color: '#B7AFA3' }}>ORBITBOYZZ · {site.location.toUpperCase()}</span>
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, maxWidth: 900 }}>{hero.headline}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#B7AFA3' }}>
          <span>{site.tagline}</span>
          <span style={{ color: '#FF4F18' }}>{site.phone}</span>
        </div>
      </div>
    ),
    size,
  )
}
