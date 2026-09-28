'use client'

import { useRef, type ReactNode } from 'react'
import { MQ } from '@/lib/motion/tokens'
import { cn } from '@/lib/cn'

/** Pointer-driven 3D tilt with a soft gold glare (CSS vars only; desktop). */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse' || !window.matchMedia(MQ.fine).matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 7}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn('tilt relative', className)}>
      <div className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
      {children}
    </div>
  )
}
