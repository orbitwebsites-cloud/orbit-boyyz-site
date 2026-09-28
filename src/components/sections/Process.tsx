'use client'

import { useRef } from 'react'
import { process, site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

const PIN = '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)'
const NO_PIN = '(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 699px) and (prefers-reduced-motion: no-preference)'

/**
 * [05 // PROCESS] Pinned vertical timeline (large screens). An orbiting dot
 * travels the track as you scroll (scrub) and each step lights up when the dot
 * reaches it. Smaller screens: the same, unpinned. Reduced motion: all lit.
 */
export function Process() {
  const section = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)

  useIsoLayoutEffect(() => {
    const el = section.current
    const ol = list.current
    if (!el || !ol) return
    const steps = Array.from(ol.querySelectorAll<HTMLElement>('[data-step]'))
    const fill = el.querySelector<HTMLElement>('[data-fill]')
    const dot = el.querySelector<HTMLElement>('[data-dot]')

    const counter = Array.from(el.querySelectorAll<HTMLElement>('[data-step-num]'))

    const setActive = (progress: number) => {
      let current = 0
      steps.forEach((s, i) => {
        const on = progress >= i / steps.length - 0.02
        s.dataset.active = on ? 'true' : 'false'
        if (on) current = i
      })
      // Giant sticky number flips to the step the dot has reached.
      counter.forEach((n, i) => {
        n.dataset.state = i === current ? 'current' : i < current ? 'past' : 'next'
      })
    }

    const build = (trigger: gsap.DOMTarget, st: ScrollTrigger.Vars) => {
      steps.forEach((s) => (s.dataset.active = 'false'))
      const tl = gsap.timeline({
        scrollTrigger: { trigger, scrub: 0.6, onUpdate: (self) => setActive(self.progress), ...st },
      })
      tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0).fromTo(
        dot,
        { y: 0 },
        { y: () => ol.offsetHeight - 2, ease: 'none' },
        0,
      )
      return () => steps.forEach((s) => delete s.dataset.active)
    }

    const mm = gsap.matchMedia()
    mm.add(PIN, () => build(el, { start: 'top top', end: '+=160%', pin: true, invalidateOnRefresh: true }))
    mm.add(NO_PIN, () => build(ol, { start: 'top 65%', end: 'bottom 60%', invalidateOnRefresh: true }))
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="process" aria-labelledby="process-title" className="relative py-24 lg:flex lg:min-h-[100svh] lg:items-center lg:py-20">
      <div className="container-x grid w-full gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel>[05 // PROCESS]</SectionLabel>
          <h2 id="process-title" className="display t-2 mt-6 max-w-[12ch]">
            From first call to launch in <span className="serif-accent text-accent">five steps.</span>
          </h2>
          <p className="t-lead mt-6 max-w-md text-muted">No sales handoff. The people on the call are the people building your site.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={site.booking} size="sm">
              Start with step one
            </Button>
          </div>

          {/* Sticky step counter (ported from v-fable): flips as the dot travels. */}
          <div className="mt-12 hidden lg:block" aria-hidden="true">
            <p className="label text-dim">Step</p>
            <div className="step-counter display mt-2 text-[clamp(5rem,11vw,9rem)] font-semibold leading-none tracking-[-0.05em] text-fg/90">
              {process.map((step, i) => (
                <span key={step.number} data-step-num data-state={i === 0 ? 'current' : 'next'}>
                  {step.number}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          {/* Track */}
          <div className="absolute bottom-3 left-[11px] top-3 w-px bg-line" aria-hidden="true">
            <div data-fill className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent/40" />
          </div>
          <div data-dot className="absolute left-0 top-2 grid h-[23px] w-[23px] place-items-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-full border border-accent/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_4px_var(--accent-glow)]" />
          </div>

          <ol ref={list} className="relative space-y-7 pl-14 lg:space-y-8">
            {process.map((step) => (
              <li
                key={step.number}
                data-step
                className="group grid gap-2 opacity-100 transition-opacity duration-[var(--d-sm)] data-[active=false]:opacity-35 sm:grid-cols-[5rem_1fr] sm:gap-6"
              >
                <span className="font-mono text-[0.8rem] tracking-[0.14em] text-dim transition-colors duration-[var(--d-sm)] group-data-[active=true]:text-accent">
                  STEP {step.number}
                </span>
                <div>
                  <h3 className="display text-[clamp(1.4rem,2.2vw,2rem)]">{step.title}</h3>
                  <p className="mt-2 max-w-lg text-[0.97rem] leading-relaxed text-muted">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
