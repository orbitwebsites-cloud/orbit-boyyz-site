'use client'

import { useRef } from 'react'
import { leadsProblem } from '@/content/leads'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap } from '@/lib/motion/gsap'
import { MQ } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

const ACCENT: ReadonlySet<string> = new Set(leadsProblem.accent)

/**
 * [01 // THE PROBLEM] Each word lights up in reading order as the statement
 * scrolls through the viewport (scrubbed, linear: the scroll is the easing),
 * like the home page's problem statement. Reduced motion: all words lit.
 */
export function LeadsProblem() {
  const section = useRef<HTMLElement>(null)
  const words = leadsProblem.statement.split(' ')

  useIsoLayoutEffect(() => {
    const el = section.current
    const statement = el?.querySelector('[data-statement]')
    if (!el || !statement) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="problem" aria-labelledby="problem-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="mb-10 flex items-center justify-between md:mb-14">
          <SectionLabel>{leadsProblem.label}</SectionLabel>
          <span className="label hidden text-dim md:block">Scroll to read</span>
        </div>
        <h2 id="problem-title" data-statement className="display t-1 max-w-[19ch] leading-[1.02] tracking-[-0.04em]">
          {words.map((w, i) => (
            <span key={i}>
              <span data-word className={ACCENT.has(w) ? 'serif-accent text-accent' : undefined}>
                {w}
              </span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </h2>
        {/* data-reveal stays off the link: a hidden (visibility) reveal can't take keyboard focus until scrolled to. */}
        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p data-reveal className="t-lead max-w-xl text-muted">
            {leadsProblem.foot}
          </p>
          <a href="#offer" className="label shrink-0 text-fg transition-colors hover:text-accent">
            <span className="text-accent">→</span> See the offer
          </a>
        </div>
      </div>
    </section>
  )
}
