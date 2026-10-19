'use client'

import { useRef } from 'react'
import { leadsRequest } from '@/content/leads'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { LEADS_REQUEST_ID } from '@/lib/leadsSite'
import { gsap, ScrollTrigger, SplitText } from '@/lib/motion/gsap'
import { DUR, EASE, MQ, STAGGER } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'
import { LeadsRequestForm } from './LeadsRequestForm'

/**
 * [06 // START FREE] The page's closing move and the target of every CTA
 * (#request): kinetic headline with the orbit behind it, then the
 * 25-free-leads request form.
 *
 * The headline's chars rise and un-rotate ONCE, on a timer, when the section
 * first scrolls into view; the reveal is never tied to the scroll position,
 * so it always runs to the end (a scrubbed reveal could stop half-way, with
 * letters clipped by their masks and the period below the baseline). Under
 * prefers-reduced-motion nothing is split or moved: the headline is static.
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
      let started = false
      let reveal: gsap.core.Tween | undefined
      const split = SplitText.create(h, {
        // Words too, so a line can only wrap between words: chars alone let
        // "Get your free 25." break mid-word ("you / r") on phones.
        type: 'words,chars',
        mask: 'chars',
        // Each char's clip box gets class ld-char-mask: leads.css pads it so the
        // tight leading and tracking don't shave the y's tail or the right edges.
        charsClass: 'ld-char',
        autoSplit: true,
        onSplit: (self) => {
          // autoSplit re-splits on resize and font load. The tween isn't
          // returned (SplitText would carry its half-way time over to the new
          // one): a re-split once the reveal has started shows the finished
          // headline instead.
          reveal?.kill()
          reveal = gsap.fromTo(
            self.chars,
            // Starts far enough down to sit fully below the padded clip box.
            { yPercent: 150, rotate: 12 },
            { yPercent: 0, rotate: 0, duration: DUR.md, ease: EASE.out, stagger: STAGGER.words, paused: true },
          )
          if (started) reveal.progress(1)
        },
      })
      // Fires once, also on load when the page opens already scrolled past
      // the start (e.g. a jump straight to #request).
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          started = true
          reveal?.play()
        },
      })
      gsap.fromTo(
        el.querySelector('[data-final-orbit]'),
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'center center', scrub: 0.8 } },
      )
      return () => {
        trigger.kill()
        reveal?.kill()
        split.revert()
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section
      ref={section}
      id={LEADS_REQUEST_ID}
      aria-labelledby="request-title"
      className="relative isolate scroll-mt-20 overflow-hidden pb-24 pt-10 md:pb-32 md:pt-24"
    >
      <div data-final-orbit className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[150vw] max-w-[78rem] -translate-x-1/2 -translate-y-1/2 opacity-80 md:w-[92vw]">
        <OrbitSystem tilt={72} coreClassName="inset-[42%] opacity-80" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--bg)_72%)]" />

      {/* Phones and tablets: one centred column. Desktop: headline left, form right, so the whole form is in view after a CTA jump.
          grid-cols-1 + min-w-0: a long word (e.g. the email on the thank-you card) wraps instead of widening the column past the screen. */}
      <div className="container-x grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col items-center text-center lg:col-span-5 lg:items-start lg:text-left">
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

        <div className="mx-auto w-full min-w-0 max-w-2xl lg:col-span-7 lg:max-w-none">
          {/* Renders its own "Prefer email?" line under the form, and drops it on the thank-you card (which already gives the email). */}
          <LeadsRequestForm />
        </div>
      </div>
    </section>
  )
}
