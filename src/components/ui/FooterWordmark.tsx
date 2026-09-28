'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/motion/gsap'
import { MQ } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

/** Oversized "ORBIT" that rises out of the page floor as you reach the bottom (scrubbed). */
export function FooterWordmark() {
  const wrap = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        word.current,
        { yPercent: 70 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={wrap} className="overflow-hidden" aria-hidden="true">
      <div
        ref={word}
        className="display select-none text-center text-[23.5vw] leading-[0.78] tracking-[-0.06em] text-transparent"
        style={{
          backgroundImage: 'linear-gradient(180deg, #f4efe6 0%, #d6b36a 55%, rgba(214,179,106,0.05) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        ORBIT
      </div>
    </div>
  )
}
