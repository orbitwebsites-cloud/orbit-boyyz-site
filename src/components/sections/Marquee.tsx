'use client'

import { Fragment, useRef } from 'react'
import { industries } from '@/content/site'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { MQ } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

/**
 * [Marquee] Infinite industries strip. Base drift is constant; scroll velocity
 * adds speed and scroll direction flips it. Reduced motion → static, wrapped list.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const el = track.current
      const rootEl = root.current
      if (!el || !rootEl) return
      rootEl.dataset.moving = 'true'
      let x = 0
      let dir = -1
      let boost = 0
      const base = 60 // px per second

      const st = ScrollTrigger.create({
        trigger: rootEl,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          dir = self.direction === 1 ? -1 : 1
          boost = Math.min(Math.abs(self.getVelocity()) / 4, 900)
        },
      })

      const tick = (_t: number, dtMs: number) => {
        const half = el.scrollWidth / 2
        if (!half) return
        boost *= 0.93
        x += dir * (base + boost) * (dtMs / 1000)
        if (x <= -half) x += half
        if (x > 0) x -= half
        gsap.set(el, { x })
      }
      gsap.ticker.add(tick)
      return () => {
        gsap.ticker.remove(tick)
        st.kill()
        delete rootEl.dataset.moving
      }
    })
    return () => mm.revert()
  }, [])

  const row = (copy: number) => (
    <div
      className={copy > 0 ? 'hidden shrink-0 items-center group-data-[moving=true]:flex' : 'flex w-full shrink-0 flex-wrap items-center gap-y-2 group-data-[moving=true]:w-auto group-data-[moving=true]:flex-nowrap'}
      aria-hidden={copy > 0 ? true : undefined}
    >
      {industries.map((name, i) => (
        <Fragment key={`${copy}-${name}`}>
          <span className={i % 2 === 0 ? 'display px-6 text-[clamp(2.2rem,5vw,4.6rem)]' : 'display text-outline px-6 text-[clamp(2.2rem,5vw,4.6rem)]'}>
            {name}
          </span>
          <svg width="22" height="22" viewBox="0 0 22 22" className="shrink-0" aria-hidden="true">
            <circle cx="11" cy="11" r="8" fill="none" stroke="#D6B36A" strokeWidth="1.5" />
            <circle cx="11" cy="11" r="3" fill="#F4EFE6" />
          </svg>
        </Fragment>
      ))}
    </div>
  )

  return (
    <section ref={root} aria-label="Industries we build for" className="group relative border-y border-line py-7 md:py-9">
      <div className="container-x mb-5 flex items-center justify-between">
        <p className="label">
          <span className="text-accent">[</span> Built for local businesses <span className="text-accent">]</span>
        </p>
        <p className="label hidden text-dim sm:block">{industries.length} industries · Central NJ</p>
      </div>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {/* Static layout wraps; moving layout (JS, motion allowed) is one nowrap line. */}
        <div ref={track} className="flex group-data-[moving=true]:w-max group-data-[moving=true]:flex-nowrap group-data-[moving=true]:will-change-transform">
          {row(0)}
          {row(1)}
        </div>
      </div>
    </section>
  )
}
