'use client'

import { useRef } from 'react'
import { leadsHero, leadsSteps } from '@/content/leads'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap } from '@/lib/motion/gsap'
import { MQ } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'
import { EmailCheckLegend } from './LeadRecord'
import { QualifyCta } from './QualifyCta'

/**
 * [03 // HOW IT WORKS] Vertical timeline, the home page's process pattern
 * without the pin: an orbiting dot travels the track as you scroll (scrub)
 * and each step lights up when the dot reaches it. Reduced motion: all lit.
 */
export function LeadsSteps() {
  const section = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)

  useIsoLayoutEffect(() => {
    const el = section.current
    const ol = list.current
    if (!el || !ol) return
    const steps = Array.from(ol.querySelectorAll<HTMLElement>('[data-step]'))
    const fill = el.querySelector<HTMLElement>('[data-fill]')
    const dot = el.querySelector<HTMLElement>('[data-dot]')

    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const setActive = (progress: number) => {
        steps.forEach((step, i) => {
          step.dataset.active = progress >= i / steps.length - 0.02 ? 'true' : 'false'
        })
      }
      setActive(0)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ol,
            start: 'top 65%',
            end: 'bottom 60%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(self.progress),
          },
        })
        .fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
        .fromTo(dot, { y: 0 }, { y: () => ol.offsetHeight - 24, ease: 'none' }, 0)
      return () => steps.forEach((step) => delete step.dataset.active)
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="how" aria-labelledby="how-title" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <SectionLabel>{leadsSteps.label}</SectionLabel>
          <h2 id="how-title" data-split className="display t-2 mt-6 max-w-[12ch]">
            {leadsSteps.title} <span className="serif-accent text-accent">{leadsSteps.titleAccent}</span>
          </h2>
          <p data-reveal className="t-lead mt-6 max-w-md text-muted">
            {leadsSteps.intro}
          </p>
          {/* No data-reveal on the CTA: hidden until scrolled to, it couldn't take keyboard focus. */}
          <div className="mt-8">
            <QualifyCta size="sm">{leadsHero.cta}</QualifyCta>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          {/* Track */}
          <div className="absolute bottom-6 left-[11px] top-6 w-px bg-line" aria-hidden="true">
            <div data-fill className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent/40" />
          </div>
          <div data-dot className="absolute left-0 top-6 grid h-[23px] w-[23px] place-items-center" aria-hidden="true">
            <span className="absolute inset-0 rounded-full border border-accent/60 bg-bg" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_4px_var(--accent-glow)]" />
          </div>

          <ol ref={list} className="relative space-y-4 pl-10 sm:pl-14">
            {leadsSteps.steps.map((step) => (
              <li
                key={step.number}
                data-step
                className="group rounded-[var(--radius)] border border-line bg-panel/60 p-6 transition-[opacity,border-color] duration-[var(--d-sm)] data-[active=false]:opacity-35 data-[active=true]:border-line-strong md:p-8"
              >
                <span className="font-mono text-[0.78rem] tracking-[0.14em] text-dim transition-colors duration-[var(--d-sm)] group-data-[active=true]:text-accent">
                  STEP {step.number}
                </span>
                <h3 className="display mt-3 text-[clamp(1.5rem,2.4vw,2.1rem)]">{step.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-muted">{step.copy}</p>
                {step.number === '03' && (
                  <div className="mt-5">
                    <EmailCheckLegend />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
