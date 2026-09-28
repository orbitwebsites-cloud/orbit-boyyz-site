'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { DUR, EASE, MQ } from '@/lib/motion/tokens'
import { cn } from '@/lib/cn'

/** Pulls its child toward the pointer (desktop, motion allowed). */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(MQ.fine).matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: DUR.md, ease: EASE.out })
    const yTo = gsap.quickTo(el, 'y', { duration: DUR.md, ease: EASE.out })

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])

  return (
    <span ref={ref} className={cn('inline-flex', className)}>
      {children}
    </span>
  )
}
