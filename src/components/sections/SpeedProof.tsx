'use client'

import { useRef } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap } from '@/lib/motion/gsap'
import { DUR, EASE, MQ, STAGGER } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

// These are the budget every build is held to (PLAN.md §2) — targets, not a
// claim about a specific audit.
const GAUGES = [
  { label: 'Performance', value: 95, suffix: '+' },
  { label: 'Accessibility', value: 100, suffix: '' },
  { label: 'Best practices', value: 100, suffix: '' },
  { label: 'SEO', value: 100, suffix: '' },
]
const VITALS = [
  { k: 'LCP', v: '< 2.0s', d: 'Largest paint' },
  { k: 'CLS', v: '< 0.05', d: 'Layout shift' },
  { k: 'INP', v: '< 200ms', d: 'Tap response' },
]
const STACK = ['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Hand-coded', 'No page builders', 'No plugins', 'You own the code']

const R = 46
const C = 2 * Math.PI * R

/**
 * [06 // SPEED & STACK] Lighthouse-style gauges sweep to their target and the
 * numbers count up once, on enter (expo.out, 1200ms, staggered).
 */
export function SpeedProof() {
  const section = useRef<HTMLElement>(null)

  useIsoLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const arcs = el.querySelectorAll<SVGCircleElement>('[data-arc]')
      const nums = el.querySelectorAll<HTMLElement>('[data-num]')
      gsap.set(arcs, { strokeDashoffset: C })
      nums.forEach((n) => (n.textContent = '0'))
      const tl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector('[data-gauges]'), start: 'top 80%', once: true } })
      arcs.forEach((arc, i) => {
        const value = Number(arc.dataset.value)
        const counter = { v: 0 }
        tl.to(arc, { strokeDashoffset: C * (1 - value / 100), duration: DUR.lg, ease: EASE.out }, i * STAGGER.items)
        tl.to(
          counter,
          {
            v: value,
            duration: DUR.lg,
            ease: EASE.out,
            onUpdate: () => {
              nums[i].textContent = String(Math.round(counter.v))
            },
          },
          i * STAGGER.items,
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="speed" aria-labelledby="speed-title" className="cv-auto relative border-y border-line bg-bg-2/50 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <SectionLabel>[06 // SPEED & STACK]</SectionLabel>
            <h2 id="speed-title" data-split className="display t-2 mt-6 max-w-[14ch]">
              Hand-coded. No templates. Built to be fast.
            </h2>
          </div>
          <p data-reveal className="t-lead self-end text-muted md:col-span-5 md:col-start-8">
            Heavy website builders load scripts you never asked for. We ship lean code on the same stack as the fastest companies on the web — and hold every build to this budget before launch.
          </p>
        </div>

        <div data-gauges className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4">
          {GAUGES.map((g) => (
            <div key={g.label} className="flex flex-col items-center rounded-[var(--radius)] border border-line bg-panel/70 px-4 py-8">
              <div className="relative h-32 w-32 md:h-36 md:w-36">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(244,239,230,0.08)" strokeWidth="4" />
                  <circle
                    data-arc
                    data-value={g.value}
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="#D6B36A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - g.value / 100)}
                  />
                </svg>
                <span className="display absolute inset-0 grid place-items-center text-[2.4rem] md:text-[2.8rem]">
                  <span>
                    <span data-num>{g.value}</span>
                    <span className="text-accent">{g.suffix}</span>
                  </span>
                </span>
              </div>
              <p className="label mt-5 text-center">{g.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[0.72rem] tracking-[0.08em] text-dim">Lighthouse (mobile) targets for every Orbit build.</p>

        <div className="mt-14 grid gap-4 md:grid-cols-12">
          <dl data-reveal className="grid grid-cols-3 divide-x divide-line rounded-[var(--radius)] border border-line md:col-span-6">
            {VITALS.map((v) => (
              <div key={v.k} className="px-3 py-6 sm:px-4 md:px-6">
                <dt className="label">{v.k}</dt>
                <dd className="display mt-3 whitespace-nowrap text-[clamp(1.15rem,2.4vw,2.1rem)]">{v.v}</dd>
                <dd className="mt-1 text-xs text-dim">{v.d}</dd>
              </div>
            ))}
          </dl>
          <ul data-reveal className="flex flex-wrap content-center gap-2 md:col-span-6 md:pl-6">
            {STACK.map((s) => (
              <li key={s} className="rounded-full border border-line px-3.5 py-2 font-mono text-[0.75rem] tracking-[0.06em] text-muted">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
