import { ImageResponse } from 'next/og'
import { leadsContact } from '@/content/leads'

// Share card for leads.orbitboyzz.com (the /leads route). Served from
// orbitboyzz.com/leads/opengraph-image: only the exact /leads path redirects.
export const alt = 'Orbit Boyzz: verified lead lists for outbound agencies, 25 free leads to start'
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
          background: 'radial-gradient(circle at 84% 30%, rgba(214,179,106,0.32), rgba(6,6,6,0) 45%), #060606',
          color: '#F4EFE6',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 128 128" fill="none">
            <circle cx="64" cy="64" r="38" stroke="#D6B36A" strokeWidth="8" />
            <circle cx="64" cy="64" r="14" fill="#F4EFE6" />
            <path d="M24 72C40 45 78 32 106 44" stroke="#F4EFE6" strokeWidth="7" strokeLinecap="round" />
            <circle cx="104" cy="44" r="8" fill="#D6B36A" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>Orbit Boyzz</span>
            <span style={{ fontSize: 16, letterSpacing: 4, color: '#B7AFA3' }}>LEAD DATA FOR OUTBOUND AGENCIES</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 800, lineHeight: 1.0, letterSpacing: -3 }}>
          <span>Your niche.</span>
          <span style={{ color: '#D6B36A' }}>Verified leads.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#B7AFA3' }}>
          <span>Every email verified · 25 free leads to start</span>
          <span style={{ color: '#D6B36A' }}>{leadsContact.email}</span>
        </div>
      </div>
    ),
    size,
  )
}
