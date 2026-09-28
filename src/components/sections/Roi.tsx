'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { roi, site, tiers } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { DUR, EASE, MQ } from '@/lib/motion/tokens'

const JOB = { min: 100, max: 5000, step: 50 }
const CUSTOMERS = { min: 1, max: 20, step: 1 }
const PREMIUM_FROM = 3500 // "From $3,500" — premium tier in site.ts

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const pct = (v: number, r: { min: number; max: number }) => `${((v - r.min) / (r.max - r.min)) * 100}%`

/**
 * [04 // THE BUSINESS CASE] Slider-driven calculator. Results count up from 0
 * the first time the panel enters (expo.out, 1200ms), then tween to each new
 * value (400ms). Numbers are written straight to the DOM — no per-frame renders.
 */
export function Roi() {
  const [jobValue, setJobValue] = useState<number>(roi.defaults.jobValue)
  const [extra, setExtra] = useState<number>(roi.defaults.extraCustomers)
  const panel = useRef<HTMLDivElement>(null)
  const monthlyEl = useRef<HTMLSpanElement>(null)
  const yearlyEl = useRef<HTMLSpanElement>(null)
  const shown = useRef({ monthly: 0, yearly: 0 })
  const started = useRef(false)

  const monthly = jobValue * extra
  const yearly = monthly * 12
  const payback = Math.max(1, Math.ceil(PREMIUM_FROM / monthly))
  const premium = tiers.find((t) => t.id === 'premium')

  useEffect(() => {
    const write = () => {
      if (monthlyEl.current) monthlyEl.current.textContent = usd(shown.current.monthly)
      if (yearlyEl.current) yearlyEl.current.textContent = usd(shown.current.yearly)
    }
    const target = { monthly, yearly }

    if (window.matchMedia(MQ.reduce).matches) {
      shown.current = target
      write()
      return
    }

    const animate = (duration: number) =>
      gsap.to(shown.current, { ...target, duration, ease: EASE.out, overwrite: true, onUpdate: write })

    if (started.current) {
      const tween = animate(DUR.sm)
      return () => {
        tween.kill()
      }
    }

    // First reveal: count up from zero when the panel scrolls into view.
    write()
    const st = ScrollTrigger.create({
      trigger: panel.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        started.current = true
        animate(DUR.lg)
      },
    })
    return () => st.kill()
  }, [monthly, yearly])

  return (
    <section id="roi" aria-labelledby="roi-title" className="relative py-24 md:py-36">
      <div className="container-x grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <SectionLabel>{roi.label}</SectionLabel>
          <h2 id="roi-title" data-split className="display t-2 mt-6 max-w-[13ch]">
            {roi.title}
          </h2>
          <p data-reveal className="mt-6 max-w-md text-muted">
            {roi.copy}
          </p>
          <ul data-reveal className="mt-8 space-y-3">
            {roi.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[0.95rem]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div ref={panel} data-reveal className="relative overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border border-line bg-panel p-6 sm:p-8 md:col-span-7 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_70%)]" />
          <div className="relative flex items-center justify-between">
            <p className="label">
              <span className="text-accent">●</span> Calculator
            </p>
            <p className="label text-dim">Estimate only</p>
          </div>

          <div className="relative mt-8 space-y-8">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="roi-job" className="text-[0.95rem] text-muted">
                  Average job value
                </label>
                <output htmlFor="roi-job" className="display text-2xl">
                  {usd(jobValue)}
                </output>
              </div>
              <input
                id="roi-job"
                type="range"
                className="range mt-3"
                min={JOB.min}
                max={JOB.max}
                step={JOB.step}
                value={jobValue}
                onChange={(e) => {
                  started.current = true
                  setJobValue(Number(e.target.value))
                }}
                style={{ '--p': pct(jobValue, JOB) } as CSSProperties}
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="roi-extra" className="text-[0.95rem] text-muted">
                  Extra customers per month from a clearer site
                </label>
                <output htmlFor="roi-extra" className="display text-2xl">
                  {extra}
                </output>
              </div>
              <input
                id="roi-extra"
                type="range"
                className="range mt-3"
                min={CUSTOMERS.min}
                max={CUSTOMERS.max}
                step={CUSTOMERS.step}
                value={extra}
                onChange={(e) => {
                  started.current = true
                  setExtra(Number(e.target.value))
                }}
                style={{ '--p': pct(extra, CUSTOMERS) } as CSSProperties}
              />
            </div>
          </div>

          <div className="relative mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <p className="label">Extra revenue / month</p>
              <p className="display mt-3 text-[clamp(2.6rem,5vw,4.2rem)] text-accent">
                <span ref={monthlyEl}>{usd(0)}</span>
              </p>
            </div>
            <div>
              <p className="label">Per year</p>
              <p className="display mt-3 text-[clamp(2.6rem,5vw,4.2rem)]">
                <span ref={yearlyEl}>{usd(0)}</span>
              </p>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {usd(jobValue)} times {extra} customers is {usd(monthly)} a month, {usd(yearly)} a year.
          </p>

          <p className="relative mt-6 font-mono text-[0.78rem] leading-relaxed tracking-[0.04em] text-dim">
            {usd(jobValue)} × {extra} customer{extra === 1 ? '' : 's'} = {usd(monthly)}/mo.{' '}
            {premium && (
              <>
                At that pace a {premium.name.toLowerCase()} ({premium.price.toLowerCase()}) pays for itself in about{' '}
                <span className="text-fg">
                  {payback} month{payback === 1 ? '' : 's'}
                </span>
                .
              </>
            )}
          </p>

          <div className="relative mt-8 flex flex-wrap items-center gap-4">
            <Button href={site.booking} size="sm">
              Run your numbers with us
            </Button>
            <span className="text-xs text-dim">Not a promise — your traffic and close rate decide the real number.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
