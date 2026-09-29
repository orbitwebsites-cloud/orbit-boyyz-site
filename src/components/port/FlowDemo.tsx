'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

// Old GrowthPage FlowDemo — same stages, timings and copy.
const stages = [
  ['01', 'New lead', 'AC stopped cooling · Princeton, NJ'],
  ['02', 'Instant reply', 'Text sent in 42 seconds'],
  ['03', 'AI qualification', 'Issue, location and urgency captured'],
  ['04', 'Job booked', 'Tomorrow · 9:30 AM'],
] as const

export function FlowDemo() {
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!running) return undefined
    if (step >= 4) {
      const resetTimer = window.setTimeout(() => setRunning(false), 900)
      return () => window.clearTimeout(resetTimer)
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), 700)
    return () => window.clearTimeout(timer)
  }, [running, step])

  const start = () => {
    setStep(0)
    setRunning(true)
  }

  return (
    <div className="rounded-[calc(var(--radius)+0.5rem)] border border-line bg-panel/70 p-6 md:p-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="label">Interactive workflow</p>
          <h3 className="display t-3 mt-3 max-w-[20ch]">Turn a web inquiry into a booked visit.</h3>
        </div>
        <button type="button" onClick={start} disabled={running} className="btn btn-ghost btn-sm px-5! disabled:opacity-70">
          <span className={cn('h-2 w-2 rounded-full', running ? 'animate-pulse bg-accent' : 'bg-dim')} aria-hidden="true" />
          {running ? 'System running' : 'Run the demo'}
        </button>
      </div>

      <ol className="mt-10 grid gap-3 md:grid-cols-4" aria-live="polite">
        {stages.map(([number, title, detail], index) => {
          const active = step >= index + 1
          return (
            <li
              key={title}
              className={cn(
                'flex items-start gap-4 rounded-2xl border p-5 transition-[border-color,background-color] duration-[var(--d-sm)] ease-[var(--ease-out)] md:flex-col',
                active ? 'border-accent/60 bg-accent/10' : 'border-line bg-bg/40',
              )}
            >
              <span
                className={cn(
                  'grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors duration-[var(--d-sm)]',
                  active ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong text-muted',
                )}
              >
                {active ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  number
                )}
              </span>
              <span>
                <strong className="block font-semibold">{title}</strong>
                <span className="mt-1 block text-sm text-muted">{detail}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-6 text-sm text-dim">
        <span className="mr-2 rounded-full border border-line px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em]">Demo data</span>
        Your actual workflow is connected to your website, phone, calendar and CRM.
      </p>
    </div>
  )
}
