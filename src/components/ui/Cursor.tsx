'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { DUR, EASE, MQ } from '@/lib/motion/tokens'

const INTERACTIVE = 'a, button, [role="button"], summary, label, input[type="range"]'

/**
 * Desktop-only cursor: a gold dot plus a trailing ring. The ring grows over
 * links and turns into a "View case" disc over [data-cursor="view"].
 * Only mounts behaviour on (pointer: fine) with motion allowed.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring || !window.matchMedia(MQ.fine).matches) return

    const root = document.documentElement
    root.classList.add('has-cursor')

    const dx = gsap.quickTo(dot, 'x', { duration: DUR.xs, ease: EASE.out })
    const dy = gsap.quickTo(dot, 'y', { duration: DUR.xs, ease: EASE.out })
    const rx = gsap.quickTo(ring, 'x', { duration: DUR.sm, ease: EASE.out })
    const ry = gsap.quickTo(ring, 'y', { duration: DUR.sm, ease: EASE.out })

    let shown = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!shown) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        root.classList.add('cursor-visible')
        shown = true
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const over = (e: PointerEvent) => {
      const target = e.target as Element | null
      const view = target?.closest<HTMLElement>('[data-cursor="view"]')
      let state = ''
      if (view) {
        state = 'view'
        if (labelRef.current) labelRef.current.textContent = view.dataset.cursorLabel ?? 'View case'
      } else if (target?.closest(INTERACTIVE)) {
        state = 'link'
      }
      ring.dataset.state = state
      dot.dataset.state = state
    }

    const hide = () => {
      root.classList.remove('cursor-visible')
      shown = false
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', hide)
      root.classList.remove('has-cursor', 'cursor-visible')
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span>
          <b ref={labelRef}>View case</b>
        </span>
      </div>
      <div ref={dotRef} className="cursor-dot">
        <span />
      </div>
    </div>
  )
}
