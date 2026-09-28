'use client'

import { useRef } from 'react'
import { site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap, SplitText } from '@/lib/motion/gsap'
import { EASE, MQ, STAGGER } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

/**
 * [09 // LAUNCH] Giant kinetic "Let's launch." — SplitText chars rise and
 * un-rotate, scrubbed to the scroll as the section arrives. The orbit returns
 * as a callback, with the CTA as the sun at its centre.
 */
export function FinalCta() {
  const section = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)

  useIsoLayoutEffect(() => {
    const el = section.current
    const h = title.current
    if (!el || !h) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const split = SplitText.create(h, {
        type: 'chars',
        mask: 'chars',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.chars,
            { yPercent: 115, rotate: 12 },
            {
              yPercent: 0,
              rotate: 0,
              ease: EASE.inOut,
              stagger: STAGGER.words,
              scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: 0.8 },
            },
          ),
      })
      gsap.fromTo(
        '[data-final-orbit]',
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'center center', scrub: 0.8 } },
      )
      return () => split.revert()
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="launch" aria-labelledby="launch-title" className="cv-auto relative isolate overflow-hidden pb-28 pt-24 md:pb-40 md:pt-36">
      <div data-final-orbit className="pointer-events-none absolute left-1/2 top-[66%] -z-10 w-[150vw] max-w-[78rem] -translate-x-1/2 -translate-y-1/2 opacity-80 md:w-[92vw]">
        <OrbitSystem tilt={72} coreClassName="inset-[42%] opacity-80" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_72%)]" />

      <div className="container-x flex flex-col items-center text-center">
        <SectionLabel>[09 // LAUNCH]</SectionLabel>
        <h2 ref={title} id="launch-title" className="display mt-8 text-[clamp(4rem,15vw,15rem)] leading-[0.85] tracking-[-0.055em]">
          Let&rsquo;s launch.
        </h2>
        <p className="t-lead mt-8 max-w-xl text-muted">
          A free 30-minute call. Talk directly with the people building your site — leave with a clear scope, a timeline and a price.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button href={site.booking} magnetic>
            Book a free call
          </Button>
          <Button href={site.phoneHref} variant="ghost" icon="phone">
            Call {site.phoneDisplay}
          </Button>
        </div>
        <p className="mt-8 font-mono text-[0.78rem] tracking-[0.06em] text-dim">
          or email{' '}
          <a href={`mailto:${site.email}`} className="text-fg hover:text-accent">
            {site.email}
          </a>{' '}
          · {site.location}
        </p>
      </div>
    </section>
  )
}
