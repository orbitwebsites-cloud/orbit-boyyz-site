'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { DUR, EASE, MQ } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

/**
 * A figure that counts up from 0 once it scrolls into view (expo.out, 1200ms).
 * The final value is server-rendered and stays put without JS, under reduced
 * motion, or when the figure is already on screen. Screen readers get the
 * final value only.
 */
export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const final = `${value}${suffix}`

  useIsoLayoutEffect(() => {
    const el = ref.current
    const text = el?.firstChild
    if (!el || !text) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return
      const state = { n: 0 }
      // Mutate the existing text node so React's DOM stays intact.
      const write = () => {
        text.nodeValue = `${Math.round(state.n)}${suffix}`
      }
      write()
      const tween = gsap.to(state, {
        n: value,
        duration: DUR.lg,
        ease: EASE.out,
        onUpdate: write,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        text.nodeValue = `${value}${suffix}`
      }
    })
    return () => mm.revert()
  }, [value, suffix])

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </>
  )
}
