'use client'

import { useRef } from 'react'
import { leadsContact, leadsRequest } from '@/content/leads'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LEADS_REQUEST_ID } from '@/lib/leadsSite'
import { gsap, SplitText } from '@/lib/motion/gsap'
import { EASE, MQ, STAGGER } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'
import { LeadsRequestForm } from './LeadsRequestForm'

/**
 * [06 // START FREE] The page's closing move and the target of every CTA
 * (#request): kinetic headline (chars rise and un-rotate, scrubbed to the
 * scroll) with the orbit behind it, then the 25-free-leads request form.
 */
export function LeadsRequest() {
  const section = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)

  useIsoLayoutEffect(() => {
    const el = section.current
    const h = title.current
    if (!el || !h) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const split = SplitText.create(h, {
        // Words too, so a line can only wrap between words: chars alone let
        // "Get your free 25." break mid-word ("you / r") on phones.
        type: 'words,chars',
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
              scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: 0.8 },
            },
          ),
      })
      gsap.fromTo(
        el.querySelector('[data-final-orbit]'),
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'center center', scrub: 0.8 } },
      )
      return () => split.revert()
    })
    return () => mm.revert()
  }, [])

  return (
    <section
      ref={section}
      id={LEADS_REQUEST_ID}
      aria-labelledby="request-title"
      className="relative isolate scroll-mt-20 overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24"
    >
      <div data-final-orbit className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[150vw] max-w-[78rem] -translate-x-1/2 -translate-y-1/2 opacity-80 md:w-[92vw]">
        <OrbitSystem tilt={72} coreClassName="inset-[42%] opacity-80" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_72%)]" />

      {/* Phones and tablets: one centred column. Desktop: headline left, form right, so the whole form is in view after a CTA jump. */}
      <div className="container-x grid items-center gap-10 md:gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-center text-center lg:col-span-5 lg:items-start lg:text-left">
          <SectionLabel>{leadsRequest.label}</SectionLabel>
          <h2
            ref={title}
            id="request-title"
            className="display mt-7 text-balance text-[clamp(3.2rem,9.5vw,6.75rem)] leading-[0.9] tracking-[-0.055em] lg:text-[clamp(4rem,6.2vw,6.75rem)]"
          >
            {leadsRequest.title}
          </h2>
          <p className="t-lead mt-6 max-w-xl text-muted lg:max-w-md">{leadsRequest.copy}</p>
          <p className="mt-4 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-dim">{leadsRequest.small}</p>
        </div>

        <div className="mx-auto w-full max-w-2xl lg:col-span-7 lg:max-w-none">
          <LeadsRequestForm />
          <p className="mt-6 text-center text-sm text-dim">
            Prefer email?{' '}
            <a href={`mailto:${leadsContact.email}?subject=25%20free%20leads`} className="link-u text-fg">
              {leadsContact.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
