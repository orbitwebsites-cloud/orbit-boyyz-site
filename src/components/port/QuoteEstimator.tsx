'use client'

import { useEffect, useMemo, useState } from 'react'
import { site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'
import {
  calculateQuoteEstimate,
  quoteOptions,
  type AiEmployee,
  type QuoteComplexity,
  type QuoteNeed,
  type QuoteUrgency,
} from '@/lib/quoteEstimate'

/** Old QuoteEstimator (App.tsx) — same inputs, same math (lib/quoteEstimate.ts), same mailto. */
export function QuoteEstimator() {
  const [need, setNeed] = useState<QuoteNeed>('site')
  const [complexity, setComplexity] = useState<QuoteComplexity>('simple')
  const [urgency, setUrgency] = useState<QuoteUrgency>('normal')
  const [employee, setEmployee] = useState<AiEmployee>('none')
  const [automation, setAutomation] = useState(false)
  const [sourcePage, setSourcePage] = useState('')

  // ?source= is read after mount so the page stays fully static.
  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get('source')?.trim()
    if (!source || source.length > 120) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL on mount
    setSourcePage(source.replace(/[^a-zA-Z0-9/?&=._#%-]/g, ''))
  }, [])

  const estimate = useMemo(() => calculateQuoteEstimate({ need, complexity, urgency, employee, automation }), [automation, complexity, employee, need, urgency])

  const selectedNeed = quoteOptions.need.find(([value]) => value === need)?.[1] ?? 'New website'
  const selectedComplexity = quoteOptions.complexity.find(([value]) => value === complexity)?.[1] ?? 'Simple'
  const selectedUrgency = quoteOptions.urgency.find(([value]) => value === urgency)?.[1] ?? 'Normal timeline'
  const selectedEmployee = quoteOptions.employee.find(([value]) => value === employee)?.[1] ?? 'Not sure yet'
  const quoteMailto = `mailto:${site.email}?subject=${encodeURIComponent(`Orbit project range: ${selectedNeed}`)}&body=${encodeURIComponent(
    [
      'Hi Orbit Boyzz,',
      '',
      'I used the project range estimator and want to talk about this build.',
      '',
      `Need: ${selectedNeed}`,
      `Complexity: ${selectedComplexity}`,
      `Timeline: ${selectedUrgency}`,
      `AI employee: ${selectedEmployee}`,
      `Automation add-on: ${automation ? 'Yes' : 'No'}`,
      ...(sourcePage ? [`Source page: ${sourcePage}`] : []),
      `Estimated upfront build: ${estimate.upfront}`,
      `Estimated monthly care / ops: ${estimate.monthly}`,
      '',
      'Business name:',
      'Website:',
      'Service area:',
      'Best phone number:',
      '',
      'What I want the website to help with:',
    ].join('\n'),
  )}`

  return (
    <section id="quote-estimator" aria-labelledby="estimator-title" className="container-x scroll-mt-28 pb-16 md:pb-24">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <SectionLabel>[QUOTE // QUICK ESTIMATE]</SectionLabel>
          <h2 id="estimator-title" className="display t-2 mt-6 max-w-[20ch] text-balance">
            Answer a few questions and get a rough Orbit build range.
          </h2>
        </div>
        <p className="max-w-xl leading-relaxed text-muted md:col-span-5">
          This is intentionally a range, not a final invoice. A normal site can stay closer to the low end. AI agents, pricing logic, dashboards, and operations automation
          push the project higher.
        </p>
      </div>

      {sourcePage ? (
        <p className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">
          Estimate started from {sourcePage}
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <div className="grid gap-9 rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8 lg:col-span-7">
          <Segment title="[01 // WHAT DO YOU NEED?]" options={quoteOptions.need} value={need} onChange={setNeed} />
          <Segment title="[02 // COMPLEXITY]" options={quoteOptions.complexity} value={complexity} onChange={setComplexity} />
          <Segment title="[03 // TIMELINE]" options={quoteOptions.urgency} value={urgency} onChange={setUrgency} />
          <Segment title="[04 // WHICH AI EMPLOYEE?]" options={quoteOptions.employee} value={employee} onChange={setEmployee} />
          <label
            className={cn(
              'flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors duration-[var(--d-sm)]',
              automation ? 'border-accent/60 bg-accent/10' : 'border-line bg-bg/40 hover:border-line-strong',
            )}
          >
            <input type="checkbox" checked={automation} onChange={(e) => setAutomation(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#d6b36a]" />
            <span>
              <span className="block font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">[05 // AUTOMATION ADD-ON]</span>
              <span className="mt-2 block leading-relaxed text-muted">Include follow-up automation, quote routing, booking logic, or a starter AI workflow.</span>
            </span>
          </label>
        </div>

        <div
          aria-live="polite"
          className="flex flex-col justify-between gap-10 rounded-[var(--radius)] border border-accent/30 bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.14),transparent_60%),var(--panel)] p-6 md:p-8 lg:sticky lg:top-24 lg:col-span-5 lg:self-start"
        >
          <div>
            <SectionLabel>[ESTIMATED RANGE]</SectionLabel>
            <dl className="mt-8 grid gap-6">
              <div>
                <dt className="label">Upfront build</dt>
                <dd className="display mt-2 text-[clamp(2.4rem,6vw,4rem)] leading-none [overflow-wrap:anywhere]">{estimate.upfront}</dd>
              </div>
              <div>
                <dt className="label">Monthly care / ops</dt>
                <dd className="display mt-2 text-[clamp(1.7rem,4vw,2.4rem)] leading-none text-accent [overflow-wrap:anywhere]">{estimate.monthly}</dd>
                <dd className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-dim">{estimate.savings}</dd>
              </div>
              <div>
                <dt className="label">Comparable employee cost</dt>
                <dd className="display mt-2 text-[clamp(1.5rem,3.4vw,2rem)] leading-tight [overflow-wrap:anywhere]">{estimate.employeeCost}</dd>
              </div>
            </dl>
            <p className="mt-6 leading-relaxed text-muted">{estimate.note}</p>
            <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">[READY TO SEND]</p>
              <p className="mt-3 leading-relaxed text-muted">Send this estimate with your business name, website, service area, and the problem the site needs to solve.</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">Likely includes</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {estimate.includes.map((item) => (
                <li key={item} className="rounded-full border border-line bg-bg/50 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={quoteMailto}>Send this range</Button>
              <Button href={site.booking} variant="ghost">
                Book a 30-min call
              </Button>
              <Button href="/contact" variant="ghost" size="sm">
                Contact options
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Segment<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: Array<[T, string]>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend>
        <SectionLabel>{title}</SectionLabel>
      </legend>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map(([optionValue, label]) => {
          const active = value === optionValue
          return (
            <button
              key={optionValue}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(optionValue)}
              className={cn(
                'display rounded-2xl border px-4 py-4 text-left text-lg transition-[background-color,border-color,color] duration-[var(--d-sm)] ease-[var(--ease-out)]',
                active ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-bg/40 text-fg hover:border-accent/50',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
