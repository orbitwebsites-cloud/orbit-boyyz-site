import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

// Pure-CSS 3D orbit system (no JS). Used as the hero's static-first fallback
// (painted with the HTML, before/without the WebGL scene) and as the "sun"
// behind the final CTA. Rings rotate on the compositor; reduced motion freezes them.

const RINGS = [
  { size: 36, dur: 24, color: '#F4EFE6', delay: -4 },
  { size: 54, dur: 36, color: '#D6B36A', delay: -20 },
  { size: 72, dur: 52, color: '#7FB4FF', delay: -9 },
  { size: 92, dur: 74, color: '#ECD29A', delay: -41 },
] as const

type Props = {
  className?: string
  tilt?: number
  children?: ReactNode
  coreClassName?: string
}

export function OrbitSystem({ className, tilt = 68, children, coreClassName }: Props) {
  return (
    <div className={cn('orbit-sys', className)} style={{ '--tilt': `${tilt}deg` } as CSSProperties} aria-hidden={children ? undefined : true}>
      <div className="orbit-plane">
        {RINGS.map((r, i) => (
          <div
            key={i}
            className="orbit-ring"
            style={
              {
                inset: `${(100 - r.size) / 2}%`,
                animationDuration: `${r.dur}s`,
                animationDelay: `${r.delay}s`,
              } as CSSProperties
            }
          >
            <span
              className="orbit-planet"
              style={
                {
                  '--c': r.color,
                  animationDuration: `${r.dur}s`,
                  animationDelay: `${r.delay}s`,
                } as CSSProperties
              }
            />
          </div>
        ))}
      </div>
      <div className={cn('orbit-core', coreClassName)}>{children}</div>
    </div>
  )
}
