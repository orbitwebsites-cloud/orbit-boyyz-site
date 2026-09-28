'use client'

import { useRef } from 'react'
import { problem, site } from '@/content/site'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap } from '@/lib/motion/gsap'
import { MQ } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

const KEY = new Set(['sit', 'there.', 'slow,', 'lose', 'call.'])

/**
 * [01 // THE PROBLEM] Pinned on desktop; each word lights up in reading order
 * as you scroll (scrubbed, linear — the scroll *is* the easing). Mobile gets the
 * same scrub without the pin. Reduced motion → all words lit.
 */
export function Problem() {
  const section = useRef<HTMLElement>(null)
  const words = problem.statement.split(' ')

  useIsoLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const mm = gsap.matchMedia()
    const targets = () => el.querySelectorAll<HTMLElement>('[data-word]')

    mm.add(MQ.desktop, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', pin: true, scrub: 0.6 },
      })
      tl.fromTo(targets(), { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1 })
        .fromTo(el.querySelector('[data-problem-foot]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'none', duration: 0.6 }, '>-0.4')
    })

    mm.add(MQ.mobile, () => {
      gsap.fromTo(
        targets(),
        { opacity: 0.14 },
        { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } },
      )
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="problem" className="relative flex items-center py-24 md:min-h-[100svh]">
      <div className="container-x w-full">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <SectionLabel>{problem.label}</SectionLabel>
          <span className="label hidden text-dim md:block">Scroll to read</span>
        </div>
        <p className="display t-1 max-w-[18ch] leading-[1.02] tracking-[-0.04em]">
          {words.map((w, i) => (
            <span key={i}>
              <span data-word className={KEY.has(w) ? 'serif-accent text-accent' : undefined}>
                {w}
              </span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </p>
        <div data-problem-foot className="mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="t-lead max-w-xl text-muted">
            We build the opposite: a fast, clear site with one job — turning the visitor who is ready into a call, a quote or a booking.
          </p>
          <a href={site.phoneHref} className="label shrink-0 text-fg transition-colors hover:text-accent">
            <span className="text-accent">→</span> Talk to us: {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
